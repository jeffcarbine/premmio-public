// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { smoothScroll } from "../../scripts/smoothScroll/smoothScroll.js";

/**
 * Skips to the main content of the page.
 *
 * @param {HTMLElement} button - The button element that triggers the skip.
 */
const skipToMainContent = (button) => {
  const query = button.dataset.query;

  let mainContent = document.querySelector(query);
  mainContent.setAttribute("tabindex", "0");

  smoothScroll({ query });

  setTimeout(() => {
    mainContent.focus();
  }, 500);
};

addEventDelegate("click", "#skipToMainContent", skipToMainContent);
