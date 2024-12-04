/**
 * Splits a string at the nth instance of a specified character.
 *
 * @param {string} str - The string to split.
 * @param {string} char - The character to split the string at.
 * @param {number} n - The instance of the character to split at.
 * @returns {Array<string>} An array containing the two parts of the split string.
 */
export const splitAtNthInstance = (str, char, n) => {
  const tokens = str.split(char).slice(n),
    result = char + tokens.join(char);

  return [str.replace(result, ""), result];
};
