// Third-Party Imports
import { load as cheerioLoad } from "cheerio";
import cloudscraper from "cloudscraper";

/**
 * Retrieves Kicktraq data for a given relative path.
 *
 * @param {string} relativePath - The relative path to the Kicktraq project.
 * @param {function} callback - The callback function to execute after retrieving the data.
 * @returns {Promise<void>} - The retrieved Kicktraq data.
 */
export const getKicktraqData = async (relativePath, callback) => {
  try {
    // Fetch the HTML from Kicktraq
    const html = await cloudscraper.get(
      `https://www.kicktraq.com/${relativePath}`
    );
    const cheerioPage = cheerioLoad(html);

    // Extract the funding information
    const text = cheerioPage("#project-info-text").text().trim();
    const funding = text.split("Funding:")[1].split("Dates")[0].split(" of ");
    const goal = funding[1].trim();
    const total = funding[0].trim();

    const data = {
      goal,
      total,
    };

    // Execute the callback function if provided
    if (callback && typeof callback === "function") {
      callback(null, data);
    } else {
      return data;
    }
  } catch (err) {
    console.error(err);
    if (callback && typeof callback === "function") {
      callback(err);
    } else {
      throw err;
    }
  }
};
