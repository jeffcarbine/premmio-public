/**
 * Determines whether to use "a" or "an" before a given word based on English grammar rules.
 *
 * @param {string} word - The word to determine the article for.
 * @returns {string} Returns "an" if the word starts with a vowel, otherwise returns "a".
 */
export const aOrAn = (word) => {
  const firstLetter = word.charAt(0).toLowerCase();
  return "aeiou".includes(firstLetter) ? "an" : "a";
};
