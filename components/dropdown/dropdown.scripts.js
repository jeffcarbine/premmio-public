// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

// Components
import {
  toggleAccordion,
  closeAccordion,
} from "../accordion/accordion.scripts.js";

/**
 * Handles the click event for a dropdown button.
 *
 * @param {HTMLElement} dropdownButton - The button element that triggers the dropdown.
 */
const handleDropdownClick = (dropdownButton) => {
  let dropdownBody = dropdownButton.nextElementSibling;

  toggleDropdown(dropdownBody, dropdownButton);
};

/**
 * Toggles the dropdown by using the accordion toggle function.
 *
 * @param {HTMLElement} dropdownBody - The body element of the dropdown.
 * @param {HTMLElement} dropdownButton - The button element that triggers the dropdown.
 */
const toggleDropdown = (dropdownBody, dropdownButton) => {
  toggleAccordion(dropdownBody, dropdownButton);
};

addEventDelegate("click", ".dropdown > button", handleDropdownClick);

/**
 * Handles the click event for a dropdown select radio button.
 *
 * @param {HTMLInputElement} radio - The radio input element that triggers the dropdown select.
 */
const handleDropdownSelectClick = (radio) => {
  // so what we need to do is find the main button for the dropdown
  const dropdown = radio.closest(".dropdown"),
    mainDropdownButton = dropdown.querySelector(":scope > button"),
    mainDropdownBody = dropdown.querySelector(":scope > div");

  // now we just update the text
  const textContent = radio.dataset.label;
  mainDropdownButton.textContent = textContent;

  // and toggle the dropdown
  closeAccordion(mainDropdownBody, mainDropdownButton);
};

addEventDelegate(
  "change",
  ".dropdown.select input[type='radio']",
  handleDropdownSelectClick
);
