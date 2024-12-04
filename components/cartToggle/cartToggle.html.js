// Elements
import { Button, Span } from "../../template/elements.html.js";

// Components
import { Icon } from "../icon/icon.html.js";

/**
 * Creates a cart toggle button component.
 *
 * @param {string} [target="#cart"] - The target element selector for the cart.
 * @returns {Button} The cart toggle button component.
 */
export const CartToggle = (target = "#cart") => {
  return new Button({
    "data-component": "cartToggle",
    "data-target": target,
    id: "cartToggle",
    child: {
      class: "positioner",
      children: [
        new Span({
          class: "itemCount",
          child: new Span({
            class: "number",
            "data-emit": "cartCount",
          }),
        }),
        new Icon("cart"),
      ],
    },
  });
};
