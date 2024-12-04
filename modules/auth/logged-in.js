/**
 * Checks if a user is logged in based on the request object.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object in the request.
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
export default (req) => {
  if (req.user) {
    return true;
  }

  return false;
};
