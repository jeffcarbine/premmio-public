/**
 * Removes a substring from a string based on the start and end indices.
 *
 * @param {string} str - The original string.
 * @param {number} start - The start index of the substring to remove.
 * @param {number} end - The end index of the substring to remove.
 * @returns {string} The string with the specified substring removed.
 */
export const removeSubstring = (str, start, end) => {
  return str.substring(0, start) + str.substring(end);
};
