// Standard Library Imports
// (none)

// Modules
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

// Components
import { Dropdown } from "./dropdown.html.js";

// Elements
import { Ul, RadioInput } from "../../template/elements.html.js";

/**
 * Creates a dropdown select component.
 *
 * @param {Object} params - The parameters for the dropdown select.
 * @param {string} [params.className=""] - The class name for the dropdown select.
 * @param {string} [params.title=""] - The title for the dropdown select.
 * @param {string} [params.name=""] - The name for the dropdown select.
 * @param {Array<Object>} [params.options=[]] - The options for the dropdown select.
 * @param {boolean} [params.btn=true] - Whether to include a button in the dropdown select.
 * @returns {Object} The dropdown select component configuration.
 */
export const DropdownSelect = ({
  className = "",
  title = "",
  name = "",
  options = [],
  btn = true,
} = {}) => {
  const children = [];

  let dropdownTitle = title;

  if (name === "") {
    name = generateUniqueId();
  }

  options.forEach((option, index) => {
    option.name = name;

    if (index === 0) {
      option.checked = true;
      dropdownTitle = option.label;
    }

    const button = new RadioInput({
      ...option,
      "data-label": option.label,
    });

    children.push(button);

    if (dropdownTitle === "") {
      dropdownTitle = option.textContent;
    }
  });

  const body = {
    child: new Ul(children),
  };

  return Dropdown({
    className: "select " + className,
    title: dropdownTitle,
    body,
    btn,
  });
};
