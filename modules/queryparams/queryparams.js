/**
 * Proxy to handle URL query parameters.
 */
export const queryparams = new Proxy(
  new URLSearchParams(window.location.search),
  {
    /**
     * Gets the value of the specified query parameter.
     *
     * @param {URLSearchParams} searchParams - The URLSearchParams object.
     * @param {string} prop - The name of the query parameter.
     * @returns {string|null} The value of the query parameter, or null if not found.
     */
    get: (searchParams, prop) => searchParams.get(prop),
  }
);
