/**
 * Normalize a string by converting it to lowercase and removing punctuation.
 * @param {string} str - The string to normalize.
 * @returns {string} - The normalized string.
 */
const normalizeString = (str) => {
  // Convert to lowercase
  str = str.toLowerCase();
  // Remove punctuation
  str = str.replace(/[^\w\s]/g, "");
  return str;
};

// Define a set of common stop words
const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "if",
  "in",
  "into",
  "is",
  "it",
  "no",
  "not",
  "of",
  "on",
  "or",
  "such",
  "that",
  "the",
  "their",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "was",
  "will",
  "with",
]);

/**
 * Tokenize a string by splitting it into words and removing common stop words.
 * @param {string} str - The string to tokenize.
 * @returns {Array<string>} - The array of tokens.
 */
const tokenizeString = (str) => {
  // Split the string into words
  let tokens = str.split(/\s+/);
  // Remove common stop words
  tokens = tokens.filter((token) => !stopWords.has(token));
  return tokens;
};

/**
 * Calculate the Jaccard similarity coefficient between two sets of tokens.
 * @param {Array<string>} tokens1 - The first set of tokens.
 * @param {Array<string>} tokens2 - The second set of tokens.
 * @returns {number} - The Jaccard similarity coefficient between the two sets.
 */
const jaccardSimilarity = (tokens1, tokens2) => {
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
};

/**
 * Calculate the Levenshtein distance between two strings.
 * @param {string} s1 - The first string.
 * @param {string} s2 - The second string.
 * @returns {number} - The Levenshtein distance between the two strings.
 */
const levenshteinDistance = (s1, s2) => {
  const matrix = [];
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[s1.length][s2.length];
};

/**
 * Calculate the similarity score between two strings using a combination of Jaccard similarity and Levenshtein distance.
 * @param {string} s1 - The first string.
 * @param {string} s2 - The second string.
 * @returns {number} - The combined similarity score between the two strings.
 */
const combinedSimilarity = (s1, s2) => {
  // Normalize the strings
  s1 = normalizeString(s1);
  s2 = normalizeString(s2);
  // Tokenize the strings
  const tokens1 = tokenizeString(s1);
  const tokens2 = tokenizeString(s2);
  // Calculate Jaccard similarity
  const jaccard = jaccardSimilarity(tokens1, tokens2);
  // Calculate Levenshtein distance
  const levenshtein = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  const levenshteinRatio = (maxLen - levenshtein) / maxLen;
  // Combine the two metrics with weights

  const combinedScore = 0.5 * jaccard + 0.5 * levenshteinRatio;
  return combinedScore;
};

/**
 * Check if two strings match using a fuzzy matching algorithm.
 * @param {Object} options - The options object.
 * @param {string} options.s1 - The first string.
 * @param {string} options.s2 - The second string.
 * @param {number} [options.threshold=0.8] - The minimum match ratio required to consider the strings as matching.
 * @param {Array<string>} [options.excludeSubstrings=[]] - An array of substrings to exclude from the matching process.
 * @returns {boolean} - True if the strings match, false otherwise.
 */
export const fuzzyMatch = ({ s1, s2, excludeSubstrings = [] }) => {
  // Remove exclude substrings from s1 and s2
  excludeSubstrings.forEach((substring) => {
    const regex = new RegExp(`\\b${substring}\\b`, "gi");
    s1 = s1.replace(regex, "");
    s2 = s2.replace(regex, "");
  });

  return combinedSimilarity(s1, s2);
};
