// Elements
import { Button } from "../../template/elements.html.js";

/**
 * Creates a dropdown component.
 *
 * @param {Object} params - The parameters for the dropdown component.
 * @param {string} [params.className=""] - The class name for the dropdown.
 * @param {string|Array} [params.title=""] - The title for the dropdown. Can be a string or an array of elements.
 * @param {Object} [params.body={}] - The body content of the dropdown.
 * @param {boolean} [params.btn=true] - Whether to include a button in the dropdown.
 * @returns {Object} The dropdown component configuration.
 */
export const Dropdown = ({
  className = "",
  title = "",
  body = {},
  btn = true,
} = {}) => {
  const btnParams = {};

  if (btn) {
    btnParams.class = "btn";
  }

  if (typeof title === "string") {
    btnParams.textContent = title;
  } else {
    btnParams.children = title;
  }

  return {
    "data-component": "dropdown",
    class: "dropdown " + className,
    children: [new Button(btnParams), body],
  };
};
