// Standard Library Imports
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import sharp from "sharp";

// Third-Party Imports
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";

import { basename } from "path";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } =
  process.env;

// Configure AWS SDK
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to Amazon S3.
 * @param {Object} file - The file object to upload.
 * @returns {Promise} - A promise that resolves with the S3 upload response and CloudFront URL.
 */
export const uploadFileToS3 = async (file) => {
  const bucketName = process.env.S3_BUCKET;
  const cloudFrontUrl = process.env.CLOUDFRONT_URL;

  const originalName = file.originalname;
  const timestamp = Date.now();
  const dotIndex = originalName.lastIndexOf(".");
  let baseName = originalName.substring(0, dotIndex);
  const extension = originalName.substring(dotIndex);

  // Replace spaces with underscores in the baseName
  baseName = baseName.replace(/\s+/g, "_");

  // Create the new filename with the timestamp
  const newFilename = `${baseName}-${timestamp}${extension}`;

  const params = {
    Bucket: bucketName,
    Key: newFilename,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentLength: file.buffer.length,
    ACL: "public-read",
  };

  try {
    const command = new PutObjectCommand(params);
    const s3Response = await s3Client.send(command);

    // Construct the CloudFront URL
    const cloudFrontFileUrl = `${cloudFrontUrl}/${newFilename}`;

    return {
      ...s3Response,
      cloudFrontUrl: cloudFrontFileUrl,
      extension,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

/**
 * Resizes an image to multiple breakpoints and uploads them to S3.
 * @param {Object} file - The image file to resize and upload.
 * @returns {Promise<Object>} - A promise that resolves with an object containing the keys and responses from the uploadFileToS3 function by breakpoint name.
 */
export const resizeAndUploadImageToS3 = async (file) => {
  const breakpoints = {
    xs: 100,
    sm: 500,
    md: 1000,
    lg: 1600,
  };
  ``;

  const imagesToUpload = [];

  for (const [breakpoint, width] of Object.entries(breakpoints)) {
    try {
      const resizedImage = await sharp(file.buffer)
        .resize({ width })
        .toBuffer();

      const newFile = {
        ...file,
        buffer: resizedImage,
        originalname: `${
          file.originalname.split(".")[0]
        }__${breakpoint}${file.originalname.substring(
          file.originalname.lastIndexOf(".")
        )}`,
        size: resizedImage.length,
      };

      imagesToUpload.push(newFile);
    } catch (error) {
      console.error(
        `Error resizing image for breakpoint ${breakpoint}:`,
        error
      );
    }
  }

  // Add the original file to the upload list
  imagesToUpload.push(file);

  const uploadPromises = imagesToUpload.map(async (imageFile) => {
    try {
      const response = await uploadFileToS3(imageFile);
      return { filename: imageFile.originalname, response };
    } catch (error) {
      console.error(`Error uploading file ${imageFile.originalname}:`, error);
      throw error;
    }
  });

  const uploadResults = await Promise.all(uploadPromises);

  // Construct the result object
  const result = {};
  for (const { filename, response } of uploadResults) {
    const parts = filename.split("__");
    const breakpoint =
      parts.length > 1 ? parts.pop().split(".")[0] : "fullsize";
    result[breakpoint] = response;
  }

  return result;
};

/**
 * Fetches an image from a URL and converts it into a format that can be passed to resizeAndUploadImageToS3.
 * @param {string} imageUrl - The URL of the image to fetch.
 * @returns {Promise<Object>} - The result of the resize and upload operation.
 */
export const fetchAndResizeAndUploadImageFromUrl = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    // Parse the URL and extract the pathname
    const url = new URL(imageUrl);
    const pathname = url.pathname;

    // Get the basename without query strings
    const originalname = basename(pathname);

    const file = {
      buffer,
      originalname,
      mimetype: response.headers["content-type"],
      size: buffer.length,
    };

    const result = await resizeAndUploadImageToS3(file);
    return result;
  } catch (error) {
    console.error(
      `Error fetching or uploading image from URL ${imageUrl}:`,
      error
    );
    throw error;
  }
};

/**
 * Uploads a base64 encoded image to S3.
 *
 * @param {string} base64 - The base64 encoded image.
 * @param {Function} callback - The callback function to handle the response.
 */
export const uploadBase64ToS3 = async (base64, callback) => {
  const cloudfrontURL = process.env.CLOUDFRONT_URL;

  // Configure AWS with your access and secret key.

  // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.
  const base64Data = new Buffer.from(
    base64.replace(/^data:.+;base64,/, ""),
    "base64"
  );

  // Getting the file extension
  const extension = base64.split(";")[0].split("/")[1].replace("+xml", "");

  // Getting the content type
  const ContentType = base64.split(";")[0].split(":")[1];

  // Generate the file name
  const fileName = `${crypto.randomBytes(20).toString("hex")}.${extension}`;

  // With this setup, each time your user uploads an image, will be overwritten.
  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileName, // type is not required
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64", // required
    ContentType,
  });

  try {
    const response = await s3.send(params);

    const filepath = `${cloudfrontURL}/${fileName}`;
    callback(null, filepath, extension, response);
  } catch (err) {
    console.warn(err);
    callback(err);
  }
};

/**
 * Converts base64 encoded images to S3 URLs and updates the image object.
 *
 * @param {Object} image - The image object containing base64 encoded images.
 * @param {Function} callback - The callback function to handle the response.
 */
export const imageSizesToS3 = (image, callback) => {
  // loop through the images data and convert the string value from base64 to a S3 URL
  // if it isn't already a S3 URL

  const imageKeys = ["src", "src_xs", "src_md", "src_lg"];

  async.eachOf(
    image,
    (value, key, next) => {
      if (imageKeys.includes(key) && value.includes("data:image")) {
        uploadBase64ToS3(value, (err, filepath) => {
          if (err) {
            console.error(err);
          } else {
            // set the image data to the filepath
            image[key] = filepath;

            // move on to the next one
            next();
          }
        });
      } else {
        // delete the key if it's not the alt
        if (key !== "alt") {
          delete image[key];
        }

        next();
      }
    },
    (err) => {
      if (err) {
        console.error(err);
      } else {
        callback(null);
      }
    }
  );
};

// https://stackoverflow.com/questions/16803293/is-there-a-way-to-upload-to-s3-from-a-url-using-node-js

/**
 * Uploads an image from a URL to S3.
 *
 * @param {string} url - The URL of the image.
 * @param {string} bucket - The S3 bucket name.
 * @param {string} key - The S3 key (path) for the uploaded image.
 * @returns {Promise} A promise that resolves when the image is uploaded.
 */
const uploadUrlToS3 = (url, bucket, key) => {
  return axios
    .get(url, { responseType: "arraybuffer", responseEncoding: "binary" })
    .then((response) => {
      const params = {
        ContentType: response.headers["content-type"],
        ContentLength: response.data.length.toString(), // or response.header["content-length"] if available for the type of file downloaded
        Bucket: bucket,
        Body: response.data,
        Key: key,
      };
      return s3.putObject(params).promise();
    });
};
