// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { dataEmit } from "../../modules/dataEmit/dataEmit.js";

// Local Components
import { renderTemplate } from "../../template/renderTemplate.js";

// Components
import { cartContentTemplate } from "./cart.html.js";

/**
 * Closes the cart by removing the 'open' class from the cart and toggle button.
 */
const closeCart = () => {
  const cartToggle = document.querySelector("#cartToggle"),
    cartTarget = cartToggle.dataset.target,
    cart = document.querySelector(cartTarget);

  cart.classList.remove("open");
  cartToggle.classList.remove("open");
};

/**
 * Sets the cart content to a loading state.
 */
export const setCartToLoading = () => {
  const cartContent = document.querySelector("#cartContent");

  cartContent.replaceChildren();
  cartContent.classList.add("loading");
};

/**
 * Counts the total quantity of line items in the cart.
 *
 * @param {Array<Object>} lineItems - The array of line items.
 * @returns {number} The total quantity of line items.
 */
const countLineItems = (lineItems) => {
  let count = 0;

  lineItems.forEach((item) => {
    count += item.quantity;
  });

  return count;
};

/**
 * Updates the cart content with the latest data.
 *
 * @param {Object} request - The XHR request object.
 */
export const update = (request) => {
  const cartData = JSON.parse(request.response),
    cartContent = document.querySelector("#cartContent");

  cartContent.classList.remove("loading");
  cartContent.replaceChildren();

  App.render(cartContentTemplate(cartData), null, (content) => {
    cartContent.appendChild(content);
  });

  dataEmit("cartCount", countLineItems(cartData.lineItems));
};

/**
 * Modifies the quantity of a line item in the cart.
 *
 * @param {number} quantity - The new quantity of the line item.
 * @param {string} itemId - The ID of the line item.
 */
export const modifyLineItem = (quantity, itemId) => {
  setCartToLoading();

  const body = {
    itemId,
    quantity,
  };

  xhr({
    path: "/premmio/shop/modify-line-item",
    body,
    success: update,
  });
};

/**
 * Handles the change event for modifying the quantity of a line item.
 *
 * @param {HTMLInputElement} input - The input element for the line item quantity.
 */
const modifyLineItemQuantity = (input) => {
  const quantity = input.value,
    itemId = input.dataset.itemId;

  modifyLineItem(quantity, itemId);
};

addEventDelegate("change", ".lineItemQuantity input", modifyLineItemQuantity);

/**
 * Handles the click event for deleting a line item from the cart.
 *
 * @param {HTMLElement} button - The button element for deleting the line item.
 */
const deleteLineItem = (button) => {
  const itemId = button.dataset.itemId;

  modifyLineItem(0, itemId);
};

addEventDelegate("click", ".deleteLineItem", deleteLineItem);

/**
 * Retrieves the cart data and updates the cart content.
 */
export const retrieve = () => {
  // pull the discountCode from the query string, if any
  const urlParams = new URLSearchParams(window.location.search),
    discountCode = urlParams.get("discountCode");

  setCartToLoading();

  const data = {
    path: "/premmio/shop/cart",
    success: update,
  };

  if (discountCode) {
    data.body = {
      discountCode,
    };
  }

  xhr(data);
};

retrieve();

addEventDelegate("click", "#cartClose, #cartOverlay", closeCart);
