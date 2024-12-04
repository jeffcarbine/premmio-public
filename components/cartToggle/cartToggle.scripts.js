// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Toggles the cart visibility.
 *
 * @param {HTMLElement} button - The button element that triggers the cart toggle.
 */
const toggleCart = (button) => {
  const target = button.dataset.target,
    cart = document.querySelector(target);

  cart.classList.toggle("open");
  button.classList.toggle("open");
};

addEventDelegate("click", "#cartToggle", toggleCart);
