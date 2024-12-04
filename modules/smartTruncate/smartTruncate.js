/**
 * Truncates a string intelligently based on the specified length.
 * If a sentence end is found within a reasonable distance from the desired length,
 * it truncates at the sentence end. Otherwise, it truncates at the closest word end
 * and adds an ellipsis.
 *
 * @param {string} str - The string to be truncated.
 * @param {number} length - The desired length to truncate the string at.
 * @returns {string} - The truncated string.
 */
export const smartTruncate = (str, length) => {
  if (str.length <= length) {
    return str;
  }

  // a reasonable distance is a quarter of the length
  const reasonableDistance = Math.floor(length / 4),
    sentenceEndings = [".", "!", "?"];

  let truncateAt = length;

  // Check for sentence end within reasonable distance
  for (
    let i = length - reasonableDistance;
    i <= length + reasonableDistance;
    i++
  ) {
    if (sentenceEndings.includes(str[i])) {
      truncateAt = i + 1; // Include the sentence ending character
      return str.slice(0, truncateAt).trim();
    }
  }

  // If no sentence end found, find the closest word end
  for (let i = length; i >= 0; i--) {
    if (str[i] === " ") {
      truncateAt = i;
      break;
    }
  }

  // Remove any trailing punctuation before adding ellipsis
  let truncatedStr = str.slice(0, truncateAt).trim();
  truncatedStr = truncatedStr.replace(/[.,;:!?]$/, "");

  return truncatedStr + "...";
};
