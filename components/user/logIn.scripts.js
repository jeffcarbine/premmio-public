// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhrForm } from "../../modules/xhr/xhr.js";

/**
 * Handles the log in form submission.
 *
 * @param {HTMLFormElement} form - The log in form element.
 */
const logIn = (form) => {
  /**
   * Handles the success response from the XHR request.
   *
   * @param {Object} request - The XHR request object.
   */
  const success = (request) => {
    let redirect = request.response;

    // if there is a redirect parameter, it overrides the response
    const redirectParam = new URLSearchParams(window.location.search).get(
      "redirect"
    );

    if (redirectParam) {
      redirect = redirectParam;
    }

    window.location = redirect;
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "form#logInForm", logIn, true);
