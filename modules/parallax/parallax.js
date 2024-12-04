// Modules
import { addEventDelegate } from "../eventDelegate/eventDelegate.js";
import { isInViewport } from "../isInViewport/isInViewport.js";

/**
 * Applies a parallax effect to elements with the class "parallax".
 *
 * @param {string} query - The query selector for the elements to apply the parallax effect to.
 */
export const parallax = (query) => {
  /**
   * Updates the parallax effect for each element based on the scroll position.
   *
   * @param {number} scroll - The current scroll position.
   */
  const parallaxAsset = (scroll) => {
    const parallaxElements = document.querySelectorAll("[data-parallax");

    parallaxElements.forEach((element) => {
      // Calculate the element's distance from the top of the document
      const elementTopDocument =
        element.getBoundingClientRect().top + window.scrollY;

      // Calculate the viewport's bottom position
      const viewportBottom = window.innerHeight + scroll;

      // Calculate how many pixels above the fold the top of the element is
      // If the elementTopDocument is equal to or less than the viewport height,
      // the element started above the fold

      let pixelsAboveFold;
      if (elementTopDocument <= window.innerHeight) {
        pixelsAboveFold = scroll;
      } else {
        // Start counting as soon as the top of the element peeks above the fold
        pixelsAboveFold = viewportBottom - elementTopDocument;
      }

      // Ensure we only count positive integer values
      pixelsAboveFold = pixelsAboveFold > 0 ? Math.floor(pixelsAboveFold) : 0;

      // Update the --parallax property with this value
      element.style.setProperty("--parallax", `${pixelsAboveFold}`);

      // and for simplicity, give a parallaxPx property too
      element.style.setProperty("--parallaxPx", `${pixelsAboveFold}px`);
    });
  };

  /**
   * Enables the parallax effect for the specified element.
   *
   * @param {HTMLElement} element - The element to enable the parallax effect for.
   */
  const enableParallax = (element) => {
    element.setAttribute("data-parallax", "");
  };

  /**
   * Disables the parallax effect for the specified element.
   *
   * @param {HTMLElement} element - The element to disable the parallax effect for.
   */
  const disableParallax = (element) => {
    element.removeAttribute("data-parallax");
  };

  isInViewport(query, enableParallax, disableParallax);

  addEventDelegate("scroll", window, parallaxAsset);
};
