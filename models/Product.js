// Third-Party Imports
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Defines the schema for the price.
 *
 * @typedef {Object} PriceSchema
 * @property {string} amount - The amount of the price.
 * @property {string} currencyCode - The currency code of the price.
 */
const priceSchema = new Schema({
  amount: String,
  currencyCode: String,
});

/**
 * Defines the schema for the image.
 *
 * @typedef {Object} ImageSchema
 * @property {string} id - The ID of the image.
 * @property {string} src - The source URL of the image.
 * @property {string} altText - The alt text for the image.
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */
const imageSchema = new Schema({
  id: String,
  src: String,
  altText: String,
  width: Number,
  height: Number,
});

/**
 * Defines the schema for the value.
 *
 * @typedef {Object} ValueSchema
 * @property {string} name - The name of the value.
 * @property {string} id - The ID of the value.
 * @property {boolean} available - Whether the value is available.
 * @property {PriceSchema} price - The price of the value.
 * @property {PriceSchema} compareAtPrice - The compare at price of the value.
 * @property {string} imageid - The ID of the image associated with the value.
 */
const valueSchema = new Schema({
  name: String,
  id: String,
  available: Boolean,
  price: priceSchema,
  compareAtPrice: priceSchema,
  imageid: String,
});

/**
 * Defines the schema for the review.
 *
 * @typedef {Object} ReviewSchema
 * @property {string} name - The name of the reviewer.
 * @property {number} rating - The rating given by the reviewer.
 */
const reviewSchema = new Schema({
  name: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});

/**
 * Defines the schema for the product model.
 *
 * @typedef {Object} ProductSchema
 * @property {string} name - The name of the product.
 * @property {string} handle - The handle of the product.
 * @property {boolean} availableForSale - Whether the product is available for sale.
 * @property {string} description - The description of the product.
 * @property {PriceSchema} price - The price of the product.
 * @property {PriceSchema} compareAtPrice - The compare at price of the product.
 * @property {Array<ValueSchema>} values - The array of values for the product.
 * @property {string} id - The ID of the product.
 * @property {Array<ImageSchema>} images - The array of images for the product.
 * @property {Array<string>} tags - The array of tags for the product.
 * @property {string} type - The type of the product.
 * @property {Array<string>} boughtTogether - The array of products bought together with this product.
 * @property {Array<string>} recommendations - The array of recommended products.
 * @property {Array<string>} addOns - The array of add-ons for the product.
 * @property {Array<ReviewSchema>} reviews - The array of reviews for the product.
 */
const productSchema = new Schema({
  name: String,
  handle: String,
  availableForSale: Boolean,
  description: String,
  price: priceSchema,
  compareAtPrice: priceSchema,
  values: [valueSchema],
  id: String,
  images: [imageSchema],
  tags: [String],
  type: String,
  boughtTogether: {
    type: [String],
    default: [],
  },
  recommendations: {
    type: [String],
    default: [],
  },
  addOns: {
    type: [String],
    default: [],
  },
  reviews: {
    type: [reviewSchema],
    default: [],
  },
});

/**
 * Creates the model for products and exposes it to the app.
 *
 * @returns {mongoose.Model} The Product model.
 */
export default mongoose.model("Product", productSchema);
