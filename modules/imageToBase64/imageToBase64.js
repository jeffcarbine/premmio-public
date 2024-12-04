// Third-Party Imports
import axios from "axios";
import sharp from "sharp";

/**
 * Extracts the image type from a URL.
 *
 * @param {string} url - The URL of the image.
 * @returns {string} The image type (e.g., "jpeg", "png").
 */
const getImageType = (url) => {
  const match = url.match(/\.(jpeg|jpg|png|webp|gif)$/i);
  return match ? match[1].toLowerCase() : "jpeg";
};

/**
 * Fetches an image from a URL.
 *
 * @param {string} url - The URL of the image.
 * @returns {Promise<Buffer>} A promise that resolves to the image buffer.
 * @throws Will throw an error if the image cannot be fetched.
 */
const fetchImageFromUrl = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Error fetching image from URL:", error);
    throw error;
  }
};

/**
 * Resizes an image while maintaining aspect ratio and converts it to WebP format.
 *
 * @param {Buffer} imgBuffer - The buffer of the image to resize.
 * @param {number} maxSize - The maximum size (width or height) of the resized image.
 * @returns {Promise<Buffer>} A promise that resolves to the resized image buffer in WebP format.
 * @throws Will throw an error if the image cannot be resized.
 */
const resizeImage = async (imgBuffer, maxSize) => {
  try {
    const image = sharp(imgBuffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;
    const aspectRatio = width / height;

    let newWidth, newHeight;
    if (width > height) {
      newWidth = maxSize;
      newHeight = Math.round(maxSize / aspectRatio);
    } else {
      newHeight = maxSize;
      newWidth = Math.round(maxSize * aspectRatio);
    }

    const resizedBuffer = await image
      .resize(newWidth, newHeight)
      .webp()
      .toBuffer();
    return `data:image/webp;base64,${resizedBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
};

/**
 * Converts a full resolution image to WebP format.
 *
 * @param {Buffer} imgBuffer - The buffer of the image to convert.
 * @returns {Promise<string>} A promise that resolves to the WebP image as a base64 string.
 * @throws Will throw an error if the image cannot be converted.
 */
const convertToWebP = async (imgBuffer) => {
  try {
    const webpBuffer = await sharp(imgBuffer).webp().toBuffer();
    return `data:image/webp;base64,${webpBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error converting image to WebP:", error);
    throw error;
  }
};

/**
 * Processes an image from a URL by fetching it, converting it to WebP, and resizing it.
 *
 * @param {string} imageUrl - The URL of the image to process.
 * @returns {Promise<Object>} A promise that resolves to an object containing the original and resized images in WebP format.
 * @throws Will throw an error if the image cannot be processed.
 */
export async function processImageFromUrl(imageUrl) {
  try {
    // Fetch image from URL
    const imgBuffer = await fetchImageFromUrl(imageUrl);

    // Sizes for resizing
    const sizes = {
      src_lg: 1600,
      src_md: 1000,
      src_sm: 500,
      src_xs: 100,
    };

    // Create resized images
    const resizedImages = {
      src: await convertToWebP(imgBuffer), // Full resolution image converted to WebP
    };

    for (const [key, maxSize] of Object.entries(sizes)) {
      resizedImages[key] = await resizeImage(imgBuffer, maxSize);
    }

    return resizedImages;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}
