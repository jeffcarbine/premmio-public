// Elements
import { Input, Label } from "../../template/elements.html.js";

// Modules
import { capitalizeAll } from "../../modules/formatString/formatString.js";
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

/**
 * Generates a single toggle component.
 *
 * @param {Object} options - The options for the toggle component.
 * @param {string} options.name - The name of the input.
 * @param {string} [options.id=generateUniqueId()] - The ID of the input.
 * @param {string} [options.value=options.name] - The value of the input.
 * @param {string} [options.label=""] - The label text.
 * @param {string} [options.labelFor=options.id] - The label's "for" attribute.
 * @param {boolean} [options.checked=false] - Whether the input is checked.
 * @param {string} [options.dataTargets] - The data targets attribute.
 * @param {string} [options.dataId] - The data ID attribute.
 * @returns {Object} The toggle component configuration.
 */
export const ToggleSingle = ({
  name,
  id = generateUniqueId(),
  value = name,
  label = "",
  labelFor = id,
  checked = false,
  dataTargets,
  dataId,
} = {}) => {
  const checkboxData = {
    type: "checkbox",
    id,
    name,
    value,
  };

  if (checked) {
    checkboxData.checked = checked;
  }

  if (dataTargets !== undefined) {
    checkboxData["data-targets"] = dataTargets;
  }

  if (dataId !== undefined) {
    checkboxData["data-id"] = dataId;
  }

  return {
    class: "toggle single",
    children: [
      new Input(checkboxData),
      new Label({
        textContent: capitalizeAll(label),
        for: labelFor,
      }),
    ],
  };
};
