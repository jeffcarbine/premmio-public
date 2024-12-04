// Standard Library Imports
let document, fs;

const isServer = typeof window === "undefined";

if (isServer) {
  Promise.all([import("jsdom"), import("fs")])
    .then(([jsdom, fsModule]) => {
      const { JSDOM } = jsdom;
      const { window } = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
      document = window.document;
      fs = fsModule;
    })
    .catch((err) => {
      console.error("Failed to load modules:", err);
    });
} else {
  document = window.document;
}

/**
 * Truncates a string to the desired length, cutting off at the last word and adding an ellipsis.
 * @param {string} str
 * @param {int} length
 */
export const truncate = (str = "", length) => {
  if (str.length > length) {
    return str.substring(0, length).replace(/ [^ ]*$/, "...");
  }

  return str;
};

/**
 * Truncates an HTML string to the desired length, ensuring that closing tags are not cut off.
 * @param {string} html - The HTML string to truncate.
 * @param {int} length - The desired length to truncate to.
 * @returns {string} - The truncated HTML string.
 */
export const truncateHtml = (html = "", length) => {
  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  let truncatedText = "";
  let currentLength = 0;

  // Helper function to recursively truncate text nodes
  const truncateNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (currentLength + text.length > length) {
        const remainingLength = length - currentLength;
        const truncatedPart = text.substring(0, remainingLength);
        const lastSpaceIndex = truncatedPart.lastIndexOf(" ");

        if (lastSpaceIndex !== -1) {
          truncatedText += truncatedPart.substring(0, lastSpaceIndex) + "...";
          currentLength = length;
        } else {
          truncatedText += truncatedPart + "...";
          currentLength = length;
        }
      } else {
        truncatedText += text;
        currentLength += text.length;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && currentLength < length) {
      truncatedText += `<${node.tagName.toLowerCase()}${getAttributesString(
        node.attributes
      )}>`;
      node.childNodes.forEach(truncateNode);
      truncatedText += `</${node.tagName.toLowerCase()}>`;
    }
  };

  // Helper function to get attributes string from an attributes object
  const getAttributesString = (attributes) => {
    return Array.from(attributes)
      .map((attr) => ` ${attr.name}="${attr.value}"`)
      .join("");
  };

  // Start truncating from the root element
  Array.from(tempDiv.childNodes).forEach(truncateNode);

  return truncatedText;
};
