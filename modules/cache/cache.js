import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import { getRedisClient } from "../../../private/utils/redisClient.js";

const redisClient = getRedisClient();

// const flushRedisCache = async () => {
//   if (redisClient) {
//     try {
//       await redisClient.flushDb();
//       console.log("Redis cache cleared successfully");
//     } catch (err) {
//       console.error("Error clearing Redis cache:", err);
//     }
//   } else {
//     console.log("Redis client is not configured");
//   }
// };

// // Call the function to flush the Redis cache
// flushRedisCache();

/**
 * Generates a cache key based on the model name, method, and query.
 *
 * @param {Object} model - The model object.
 * @param {string} method - The MongoDB method.
 * @param {Object} query - The query object.
 * @returns {string} The generated cache key.
 */
const generateKey = (model, method, query, options, paginate) => {
  const namespace = process.env.NAMESPACE || "default";
  const queryKey = JSON.stringify(query);
  const paginateKey = paginate ? JSON.stringify(paginate) : "";
  const optionsKey = options ? JSON.stringify(options) : "";
  return `${namespace}:${model.modelName}:${method}:${queryKey}:${optionsKey}:${paginateKey}`;
};

const reformatData = (item) => {
  if (item?._doc) {
    return { ...item._doc };
  }
  return item;
};

/**
 * Queries the cache for a specific model, method, and query. If the result is not in the cache, it queries the database and caches the result.
 *
 * @param {Object} model - The model object.
 * @param {string} method - The MongoDB method.
 * @param {Object} query - The query object.
 * @param {boolean} isFindOne - Whether the query is a findOne query.
 * @returns {Promise<Array|Object>} The query result.
 */
const queryCache = async (
  model,
  method,
  query,
  projection,
  options,
  paginate
) => {
  if (!redisClient) {
    // If Redis is not configured, directly call the MongoDB method
    if (paginate) {
      return model.paginate(query, { ...options, ...paginate });
    } else {
      return model[method](query, projection, options).lean();
    }
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  const key = generateKey(model, method, query, paginate);

  // Check if the entire database is cached
  const entireDbKey = `${model.modelName}:all`;
  const entireDbCache = await redisClient.get(entireDbKey);

  if (Object.keys(query).length === 0 && !paginate && !options.sort) {
    // Only use entire database cache if there is no pagination or sorting
    let result = await redisClient.get(entireDbKey);
    if (!result) {
      result = await model.find(query, projection, options).lean();
      try {
        await redisClient.set(entireDbKey, JSON.stringify(result), { EX: 600 });
      } catch (err) {
        console.error(`Error storing to cache: ${entireDbKey}`, err);
      }
    } else {
      result = JSON.parse(result);
      result = reformatData(result);
    }

    return result;
  } else {
    // Specific query with pagination or sorting
    let result = await redisClient.get(key);
    if (!result) {
      if (paginate) {
        result = await model.paginate(query, { ...options, ...paginate });
      } else {
        result = await model[method](query, projection, options).lean();
      }

      try {
        await redisClient.set(key, JSON.stringify(result), { EX: 600 });
      } catch (err) {
        console.error(`Error storing to cache: ${key}`, err);
      }
    } else {
      try {
        result = JSON.parse(result);
      } catch (err) {
        console.error("Error parsing result from cache:", err);
        throw err; // Re-throw the error to handle it appropriately
      }

      try {
        result = reformatData(result);
      } catch (err) {
        console.error("Error reformatting result from cache:", err);
        throw err; // Re-throw the error to handle it appropriately
      }
    }

    return result;
  }
};

/**
 * Invalidates the cache for a specific Mongoose model by deleting all related cache keys.
 *
 * @param {mongoose.Model} Model - The Mongoose model for which to invalidate the cache.
 * @returns {Promise<void>} A promise that resolves when the cache invalidation is complete.
 */
const invalidateCacheForModel = async (Model) => {
  const pattern = `${Model.modelName}:*`;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.info(`Invalidated cache for keys: ${keys.join(", ")}`);
    }
  } catch (err) {
    console.error(`Error invalidating cache for pattern: ${pattern}`, err);
  }
};

/**
 * Executes a MongoDB method and handles caching.
 *
 * @param {Object} Model - The Mongoose model.
 * @param {string} method - The MongoDB method to execute.
 * @param {Array} args - The arguments to pass to the method.
 * @param {string} queryKey - The cache key.
 * @returns {Promise<any>} The result of the query.
 */
const executeMongoMethod = async (Model, method, args, queryKey) => {
  if (!redisClient) {
    // If Redis is not configured, directly call the MongoDB method
    return Model[method](...args);
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  try {
    let result;

    // Use create for inserting a document
    if (method === "insertOne" || method === "create") {
      result = await Model.create(...args);
    } else {
      result = await Model[method](...args);
    }

    // Store the result in the cache for find and findOne methods
    if (method === "find" || method === "findOne") {
      try {
        await redisClient.set(queryKey, JSON.stringify(result), { EX: 600 });
      } catch (err) {
        console.error(`error storing to cache: ${queryKey}`, err);
      }
    }

    // Update the cache for findOneAndUpdate, findOneAndReplace, insertOne, and create methods
    if (
      method === "findOneAndUpdate" ||
      method === "findOneAndReplace" ||
      method === "insertOne" ||
      method === "create"
    ) {
      // Update the cache for the specific query
      try {
        await redisClient.set(queryKey, JSON.stringify(result), { EX: 600 });
      } catch (err) {
        console.error(`error storing to cache: ${queryKey}`, err);
      }

      // Invalidate the cache for the entire collection and related keys
      await invalidateCacheForModel(Model);
    }

    // Invalidate the cache for findOneAndDelete, deleteOne, and deleteMany methods
    if (
      method === "findOneAndDelete" ||
      method === "deleteOne" ||
      method === "deleteMany"
    ) {
      try {
        await redisClient.del(queryKey);
      } catch (err) {
        console.error(`error invalidating cache for: ${queryKey}`, err);
      }

      // Invalidate the cache for the entire collection and related keys
      await invalidateCacheForModel(Model);
    }

    return reformatData(result);
  } catch (err) {
    console.error(`unexpected error in executeMongoMethod: ${err}`);
    throw err;
  }
};

/**
 * Caches a MongoDB query based on the method, model, and query parameters.
 *
 * @param {Object} params - The parameters for the cache query.
 * @param {string} [params.method="find"] - The MongoDB method to execute (e.g., "find", "findOne").
 * @param {mongoose.Model} params.Model - The Mongoose model to execute the method on.
 * @param {Object} [params.query={}] - The query object.
 * @param {Object} [params.update={}] - The update object for update methods.
 * @param {Object} [params.options={}] - The options object for the query.
 * @param {Object} [params.paginate] - The pagination options.
 * @returns {Promise<any>} The result of the query.
 */

const cacheQuery = async ({
  method,
  Model,
  query = {},
  projection = {},
  update = {},
  options = {},
  paginate,
  populate,
}) => {
  const queryKey = generateKey(Model, method, query, options, paginate);

  // Check if the result is in the cache for find and findOne methods
  if (method === "find" || method === "findOne") {
    try {
      const cachedResult = await queryCache(
        Model,
        method,
        query,
        projection,
        options,
        paginate
      );

      if (cachedResult) {
        let result = reformatData(cachedResult);
        if (populate) {
          result = await Model.populate(result, populate);
        }
        return result;
      }
    } catch (err) {
      throw err;
    }
  }

  // Determine the arguments to pass to the MongoDB method
  let args;

  if (
    [
      "findOneAndUpdate",
      "findOneAndReplace",
      "updateOne",
      "updateMany",
    ].includes(method)
  ) {
    args = [query, update, options];
  } else if (method === "find" || method === "findOne") {
    args = [query, projection, options];
  } else if (
    ["deleteOne", "deleteMany", "countDocuments", "distinct"].includes(method)
  ) {
    args = [query, options];
  } else if (method === "insertOne" || method === "create") {
    args = [query]; // For insertOne and create, query is the document to insert
  } else if (method === "insertMany") {
    args = [query]; // For insertMany, query is an array of documents to insert
  } else if (method === "aggregate") {
    args = [query]; // For aggregate, query is the aggregation pipeline
  } else {
    throw new Error("Unsupported method");
  }

  // If paginate options are provided, use mongoose-paginate
  if (paginate) {
    try {
      const result = await Model.paginate(query, paginate);
      await redisClient.set(queryKey, JSON.stringify(result), { EX: 600 });
      return result;
    } catch (err) {
      throw err;
    }
  } else {
    // Execute the MongoDB method using the refactored function
    let result = await executeMongoMethod(Model, method, args, queryKey);
    if (populate) {
      result = await Model.populate(result, populate);
    }
    return result;
  }
};

// Create the Cache object with methods for each Mongoose model method
export const Cache = {
  find: (
    Model,
    query = {},
    projection = {},
    options = {},
    paginate,
    populate
  ) =>
    cacheQuery({
      method: "find",
      Model,
      query,
      projection,
      options,
      paginate,
      populate,
    }),
  findOne: (Model, query = {}, projection = {}, options = {}, populate) =>
    cacheQuery({
      method: "findOne",
      Model,
      query,
      projection,
      options,
      populate,
    }),
  findOneAndUpdate: (Model, query = {}, update = {}, options = {}) =>
    cacheQuery({ method: "findOneAndUpdate", Model, query, update, options }),
  findOneAndReplace: (Model, query = {}, update = {}, options = {}) =>
    cacheQuery({ method: "findOneAndReplace", Model, query, update, options }),
  updateOne: (Model, query = {}, update = {}, options = {}) =>
    cacheQuery({ method: "updateOne", Model, query, update, options }),
  updateMany: (Model, query = {}, update = {}, options = {}) =>
    cacheQuery({ method: "updateMany", Model, query, update, options }),
  deleteOne: (Model, query = {}, options = {}) =>
    cacheQuery({ method: "deleteOne", Model, query, options }),
  deleteMany: (Model, query = {}, options = {}) =>
    cacheQuery({ method: "deleteMany", Model, query, options }),
  countDocuments: (Model, query = {}, options = {}) =>
    cacheQuery({ method: "countDocuments", Model, query, options }),
  distinct: (Model, query = {}, options = {}) =>
    cacheQuery({ method: "distinct", Model, query, options }),
  insertOne: (Model, document) =>
    cacheQuery({ method: "insertOne", Model, query: document }),
  insertMany: (Model, documents) =>
    cacheQuery({ method: "insertMany", Model, query: documents }),
  aggregate: (Model, pipeline) =>
    cacheQuery({ method: "aggregate", Model, query: pipeline }),
  create: (Model, document) =>
    cacheQuery({ method: "create", Model, query: document }),
};

export const Cache2 = {
  find: (
    Model,
    { query = {}, projection = {}, options = {}, paginate, populate } = {}
  ) =>
    cacheQuery({
      method: "find",
      Model,
      query,
      projection,
      options,
      paginate,
      populate,
    }),
  findOne: (
    Model,
    { query = {}, projection = {}, options = {}, populate } = {}
  ) =>
    cacheQuery({
      method: "findOne",
      Model,
      query,
      projection,
      options,
      populate,
    }),
  findOneAndUpdate: (Model, { query = {}, update = {}, options = {} } = {}) =>
    cacheQuery({ method: "findOneAndUpdate", Model, query, update, options }),
  findOneAndReplace: (Model, { query = {}, update = {}, options = {} } = {}) =>
    cacheQuery({ method: "findOneAndReplace", Model, query, update, options }),
  updateOne: (Model, { query = {}, update = {}, options = {} } = {}) =>
    cacheQuery({ method: "updateOne", Model, query, update, options }),
  updateMany: (Model, { query = {}, update = {}, options = {} } = {}) =>
    cacheQuery({ method: "updateMany", Model, query, update, options }),
  deleteOne: (Model, { query = {}, options = {} } = {}) =>
    cacheQuery({ method: "deleteOne", Model, query, options }),
  deleteMany: (Model, { query = {}, options = {} } = {}) =>
    cacheQuery({ method: "deleteMany", Model, query, options }),
  countDocuments: (Model, { query = {}, options = {} } = {}) =>
    cacheQuery({ method: "countDocuments", Model, query, options }),
  distinct: (Model, { query = {}, options = {} } = {}) =>
    cacheQuery({ method: "distinct", Model, query, options }),
  insertOne: (Model, document) =>
    cacheQuery({ method: "insertOne", Model, query: document }),
  insertMany: (Model, documents) =>
    cacheQuery({ method: "insertMany", Model, query: documents }),
  aggregate: (Model, pipeline) =>
    cacheQuery({ method: "aggregate", Model, query: pipeline }),
  create: (Model, document) =>
    cacheQuery({ method: "create", Model, query: document }),
};
