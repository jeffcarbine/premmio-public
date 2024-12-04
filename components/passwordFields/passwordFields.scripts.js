import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { passwordRegex } from "./passwordRegex.js";

/**
 * Checks the complexity of the password input.
 *
 * @param {HTMLInputElement} input - The password input element.
 */
const checkPasswordComplexity = (input) => {
  const validation = input.closest(".field").querySelector(".validation");

  if (input.value !== "") {
    if (passwordRegex.test(input.value)) {
      validation.textContent = "";
    } else {
      validation.textContent =
        "Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character";
    }
  } else {
    validation.textContent = "";
  }
};

addEventDelegate("focusout", "input[name='password']", checkPasswordComplexity);

/**
 * Checks if the password meets the required criteria.
 *
 * @param {HTMLInputElement} input - The password input element.
 */
const checkPasswordMeetsRequirements = (input) => {
  const validation = input.closest(".field").querySelector(".validation");

  if (input.value !== "") {
    if (passwordRegex.test(input.value)) {
      validation.textContent = "";
    }
  } else {
    validation.textContent = "";
  }
};

addEventDelegate(
  "keyup",
  "input[name='password']",
  checkPasswordMeetsRequirements
);

/**
 * Checks if the password and password confirmation match.
 *
 * @param {HTMLInputElement} input - The password or password confirmation input element.
 */
const checkPasswordMatch = (input) => {
  // second sibling of parent
  const validation = input.closest(".field").querySelector(".validation");

  const passwordInput =
      input.name === "password"
        ? input
        : document.querySelector("input[name='password']"),
    passwordConfirmInput =
      input.name === "passwordConfirm"
        ? input
        : document.querySelector("input[name='passwordConfirm']");

  if (
    passwordConfirmInput.value != "" &&
    passwordInput.value !== passwordConfirmInput.value
  ) {
    validation.textContent = "Passwords do not match";
  } else {
    validation.textContent = "";
  }
};

addEventDelegate(
  "keyup",
  "input[name='passwordConfirm'], input[name='password']",
  checkPasswordMatch
);
