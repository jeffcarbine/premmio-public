// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Toggles the navigation menu.
 *
 * @param {HTMLElement} button - The button element that triggers the navigation toggle.
 */
const toggleNav = (button) => {
  const query = button.dataset.target || "#navigation",
    targets = document.querySelectorAll(query);

  targets.forEach((target) => {
    if (target.classList.contains("open")) {
      target.classList.remove("open");
      button.classList.remove("open");
    } else {
      target.classList.add("open");
      button.classList.add("open");
    }
  });

  if (!button.classList.contains("previously-toggled")) {
    button.classList.add("previously-toggled");
  }
};

addEventDelegate("click", "#navToggle", toggleNav);
