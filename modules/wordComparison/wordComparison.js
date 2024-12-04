const commonWords = [
  "the",
  "and",
  "of",
  "a",
  "an",
  "in",
  "on",
  "at",
  "to",
  "with",
  "for",
  "by",
  "from",
  "is",
  "it",
  "that",
  "this",
  "these",
  "those",
  "as",
  "but",
  "or",
  "nor",
  "so",
  "yet",
  "if",
  "then",
  "else",
  "when",
  "while",
  "where",
  "which",
  "who",
  "whom",
  "whose",
  "why",
  "how",
];

/**
 * Preprocesses a string by removing non-alphanumeric characters, specified strings, converting to lowercase, and removing common words.
 *
 * @param {string} string - The string to preprocess.
 * @param {Array<string>} removeStrings - The list of strings to remove from the input string.
 * @returns {string} The preprocessed string.
 */
const preprocessString = (string, removeStrings) => {
  // Remove non-alphanumeric characters
  let processedString = string.replace(/[^a-zA-Z0-9\s]/g, "");

  // Remove specified strings
  removeStrings.forEach((removeString) => {
    const regex = new RegExp(removeString, "gi");
    processedString = processedString.replace(regex, "").trim();
  });

  // Convert to lowercase
  processedString = processedString.toLowerCase();

  // Remove common words
  processedString = processedString
    .split(/\s+/)
    .filter((word) => !commonWords.includes(word))
    .join(" ");

  return processedString;
};

/**
 * Calculates a match score between two strings based on word matches and non-matches.
 *
 * @param {string} string1 - The first string to compare.
 * @param {string} string2 - The second string to compare.
 * @returns {number} The calculated match score.
 */
const calculateScore = (string1, string2) => {
  const words1 = string1.split(/\s+/);
  const words2 = string2.split(/\s+/);

  let matchScore = 0;
  let matchCount = 0;
  const deductionPerNonMatch = 20;

  words1.forEach((word1) => {
    if (words2.includes(word1)) {
      matchCount += 1;
      matchScore += Math.pow(word1.length, 2); // Exponential factor for word length
    }
  });

  const totalLength = string1.replace(/\s+/g, "").length;
  const score = (matchScore / totalLength) * 100;

  // Calculate deductions for non-matched words in string2 only
  const nonMatchedWords2 = words2.filter((word) => !words1.includes(word));
  const totalDeductions = nonMatchedWords2.length * deductionPerNonMatch;

  // Final score with deductions
  const finalScore = score - totalDeductions;

  return finalScore;
};

/**
 * Compares two strings and returns a match score.
 *
 * @param {string} string1 - The first string to compare.
 * @param {string} string2 - The second string to compare.
 * @param {Array<string>} [removeStrings=[]] - The list of strings to remove from the input strings before comparison.
 * @returns {number} The match score between the two strings.
 */
export const wordComparison = (string1, string2, removeStrings = []) => {
  const processedString1 = preprocessString(string1, removeStrings);
  const processedString2 = preprocessString(string2, removeStrings);
  return calculateScore(processedString1, processedString2);
};
