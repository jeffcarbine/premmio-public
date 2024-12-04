// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Handles adding two decimal places on simplecurrency input focusout.
 *
 * @param {HTMLInputElement} input - The input element to format.
 */
const handleSimpleCurrency = (input) => {
  const value = parseFloat(input.value),
    formatted = value.toFixed(2);

  input.value = formatted;

  const currency = input.value,
    parent = input.parentNode,
    simplecurrencyName = input.dataset.simplecurrency,
    simpleCurrencyInput = parent.querySelector(
      `input[name='${simplecurrencyName}']`
    );

  if (!simpleCurrencyInput) return;

  const simpleCurrency = currency * 100;

  simpleCurrencyInput.value = simpleCurrency;
};

addEventDelegate(
  "focusout",
  ".field input[data-simplecurrency]",
  handleSimpleCurrency
);
