/**
 * Retrieves a list of countries with their ISO 3166-1 alpha-2 codes.
 *
 * @returns {Object} An object where the keys are country codes and the values are country names.
 */
export const generateUniqueId = (length = 6) => {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substring(2, length + 2)
  );
};
