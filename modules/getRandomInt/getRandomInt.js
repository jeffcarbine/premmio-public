/**
 * Generates a random integer between the specified minimum and maximum values.
 *
 * @param {number} max - The maximum value (inclusive).
 * @param {number} [min=0] - The minimum value (inclusive).
 * @returns {number} A random integer between min and max (inclusive).
 */
export const getRandomInt = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
