/**
 * Returns only the numeric characters from a string and parses it as a number.
 *
 * @param {string} str - The input string.
 * @returns {number} The parsed number.
 */
export const numOnly = (str) => {
  return parseInt(str.replace(/\D/g, ""));
};

/**
 * Returns a string with only lowercase alphanumeric characters.
 *
 * @param {string} str - The input string.
 * @returns {string} The formatted string.
 */
export const lowerAlphaNumOnly = (str) => {
  const formattedStr = str.replace(/\W/g, "").toLowerCase();
  return formattedStr;
};

/**
 * Returns a string with only alphanumeric characters and spaces.
 *
 * @param {string} str - The input string.
 * @returns {string} The formatted string.
 */
export const alphaNum = (str) => {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
};

/**
 * Returns a string with only lowercase alphanumeric characters and spaces.
 *
 * @param {string} str - The input string.
 * @returns {string} The formatted string.
 */
export const lowerAlphaNum = (str) => {
  return alphaNum(str).toLowerCase();
};

/**
 * Capitalizes the first character of a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The capitalized string.
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalizes the first character of each word in a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The formatted string with each word capitalized.
 */
export const capitalizeAll = (str) => {
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = capitalize(arr[i]);
  }
  return arr.join(" ");
};

/**
 * Converts a string to capital case (e.g., "example string" to "ExampleString").
 *
 * @param {string} str - The input string.
 * @returns {string} The string converted to capital case.
 */
export const capitalCase = (str) => {
  const arr = str.split(" ");

  for (var i = 0; i < arr.length; i++) {
    arr[i] = capitalize(arr[i]);
  }

  return arr.join("");
};

/**
 * Converts a camelCase string to a space-separated string with the first letter capitalized.
 *
 * @param {string} str - The camelCase string.
 * @returns {string} The de-camelized string.
 */
export const deCamelize = (str) => {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Converts a string to camelCase.
 *
 * @param {string} str - The input string.
 * @returns {string} The string converted to camelCase.
 */
export const camelize = (str) => {
  const camelized = str
    .replace(/[^a-zA-Z0-9 ]/g, "") // Keep spaces while removing other non-alphanumeric characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/[^A-Z0-9]+/gi, "");

  return camelized;
};

/**
 * Converts a string to a hyphenated string.
 *
 * @param {string} str - The input string.
 * @returns {string} The string converted to a hyphenated string.
 */
export const hyphenate = (str) => {
  const trimmed = str.trim();
  // Remove all non-alphanumeric characters (keeping spaces for hyphenation) and then replace spaces with hyphens
  return trimmed
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

/**
 * Converts a string to a URL-friendly hyphenated string.
 *
 * @param {string} str - The input string.
 * @returns {string} The URL-friendly hyphenated string.
 */
export const urlHyphenate = (str) => {
  const alphaNum = lowerAlphaNum(str),
    urlHyphenated = hyphenate(alphaNum);

  return urlHyphenated;
};

/**
 * Dehyphenates a string and capitalizes each individual word.
 *
 * @param {string} str - The input hyphenated string.
 * @returns {string} The dehyphenated string with each word capitalized.
 */
export const dehyphenate = (str) => {
  return str
    .split("-") // Split the string by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back together with spaces
};

/**
 * Converts a camelCase string to a hyphenated string.
 *
 * @param {string} str - The camelCase string.
 * @returns {string} The hyphenated string.
 */
export const camelToHyphen = (str) => {
  const deCamelized = deCamelize(str),
    hyphenated = hyphenate(deCamelized);

  return hyphenated;
};

/**
 * Encodes a string to HTML entities.
 *
 * @param {string} str - The input string.
 * @returns {string} The encoded string.
 */
export const htmlize = (str) => {
  const encodedStr = str.replace(
    /[\u00A0-\u9999<>\&]/g,
    (i) => "&#" + i.charCodeAt(0) + ";"
  );

  return encodedStr;
};

/**
 * Strips HTML tags from a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The string without HTML tags.
 */
export const stripHtml = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str
    .replace(/(<([^>]+)>)/gi, " ")
    .replaceAll("&nbsp;", " ")
    .trim();
};

/**
 * Adds the https:// protocol to a URL if it doesn't already have http:// or https://.
 *
 * @param {string} str - The input URL string.
 * @returns {string} The URL with the https:// protocol.
 */
export const urlProtocol = (str) => {
  // if the string doesn't have a http:// or https:// prefix, add it
  if (!str.includes("http")) {
    return `https://${str}`;
  } else {
    return str;
  }
};

/**
 * Splits a string into sentences based on ., !, ?, and \n delimiters, keeping the delimiters.
 *
 * @param {string} str - The input string.
 * @returns {Array<string>} An array of sentences.
 */
const splitSentences = (str) => {
  // split sentences on . ! ? and \n but keep the delimiter
  // split on . ! ? and \n but keep the delimiter
  const split = str.split(/(\. |\!|\?|\n)/);
};

/**
 * Removes empty HTML tags from a string.
 *
 * @param {string} str - The input string containing HTML.
 * @returns {string} The string with empty HTML tags removed.
 */
export const removeEmptyHtmlTags = (str) => {
  // Regular expression to match empty HTML tags
  const emptyTagRegex = /<(\w+)(\s*[^>]*)><\/\1>/g;

  // Replace empty tags with an empty string
  return str.replace(emptyTagRegex, "");
};
