// Modules
import { camelize } from "../../modules/formatString/formatString.js";

// Elements
import { Fieldset, Span } from "../../template/elements.html.js";

/**
 * Generates a toggle group component.
 *
 * @param {Object} options - The options for the toggle group component.
 * @param {string} options.label - The label for the toggle group.
 * @param {string} [options.className=""] - The class name for the toggle group.
 * @param {string} options.name - The name of the toggle group.
 * @param {Array<string>} [options.values=[]] - The array of values for the toggles.
 * @param {string} [options.checked] - The value of the checked toggle.
 * @returns {Object} The toggle group component configuration.
 */
export const ToggleGroup = ({
  label,
  className = "",
  name,
  values = [],
  checked,
} = {}) => {
  const children = [];

  values.forEach((value) => {
    const id = `${name}-${value}`;

    // create the radio
    const radio = {
      tagName: "input",
      type: "radio",
      name,
      value: camelize(value),
      id,
    };

    if (checked === value) {
      radio.checked = true;
    }

    children.push(radio);

    // create the label
    const label = {
      tagName: "label",
      for: id,
      child: new Span(value),
    };

    children.push(label);
  });

  children.push({
    tagName: "span",
    class: "pill",
  });

  return {
    "data-component": "toggle",
    class: "toggle group " + className,
    children: [
      new Fieldset({
        if: label !== undefined,
        textContent: label,
      }),
      {
        class: "radios",
        children,
      },
    ],
  };
};
