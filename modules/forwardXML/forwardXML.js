// Third-Party Imports
import fetch from "node-fetch";

/**
 * Forwards an XML feed to the client.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} feed - The URL of the XML feed to forward.
 */
export const forwardXML = (req, res, feed) => {
  fetch(feed)
    .then((response) => response.text())
    .then((feed) => res.status(200).set("Content-Type", "text/xml").send(feed));
};

/**
 * Forwards an XML feed to the client using the feed URL from environment variables.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const forwardXMLFromEnv = (req, res) => {
  const feed = process.env.FORWARD_XML_FEED;
  forwardXML(req, res, feed);
};
