// Modules
import { stripHtml } from "../formatString/formatString.js";

// Components
import { toast } from "../../components/alert/alert.js";
import {
  closeAllModals,
  closeLowestModal,
} from "../../components/modal/modal.functions.js";

/**
 * Logs the response of the request to the console.
 *
 * @param {XMLHttpRequest} request - The request object.
 */
const defaultResponse = (request) => {
  console.info(request.response);
};

/**
 * Sends an HTTP request and handles the response.
 *
 * @param {Object} options - The options for the HTTP request.
 * @param {string} [options.method='POST'] - The HTTP method to use.
 * @param {string} [options.path='/'] - The path to send the request to.
 * @param {Object|FormData} [options.body={}] - The body of the request.
 * @param {string} [options.contentType='application/json;charset=UTF-8'] - The content type of the request.
 * @param {string} [options.authorization=null] - The authorization header for the request.
 * @param {Object} [options.statusHandlers={}] - An object where each key is a status code and the value is a function to handle that status.
 * @param {Function} [options.success=defaultResponse] - The function to call when the request is successful.
 * @param {Function} [options.error=defaultResponse] - The function to call when the request results in a client error.
 * @param {Function} [options.failure=defaultResponse] - The function to call when the request results in a server error.
 * @param {Function} [options.defaultHandler=defaultResponse] - The default function to call when no other handler is provided.
 */

export const xhr = ({
  method = "POST",
  path = "/",
  body = {},
  enctype,
  authorization = null,
  statusHandlers = {},
  success = defaultResponse,
  error = defaultResponse,
  failure = defaultResponse,
  defaultHandler = defaultResponse,
} = {}) => {
  // start by creating a request
  const request = new XMLHttpRequest();
  request.open(method, path);

  // Set the Content-Type header if the body is not FormData
  if (!(body instanceof FormData)) {
    let contentType;

    if (enctype === "application/x-www-form-urlencoded") {
      contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    } else {
      contentType = "application/json;charset=UTF-8";
    }

    request.setRequestHeader("Content-Type", contentType);
  }

  if (authorization !== null) {
    request.setRequestHeader("Authorization", authorization);
  }

  request.onload = () => {
    const handler = statusHandlers[request.status];
    if (handler) {
      handler(request);
    } else {
      // if there is no matching handler, use the default for the code type

      // 200s
      if (request.status >= 200 && request.status < 300) {
        success(request);
        // 400s
      } else if (request.status >= 400 && request.status < 500) {
        error(request);
        // 500s
      } else if (request.status >= 500 && request.status < 600) {
        failure(request);
        // default
      } else {
        defaultHandler(request);
      }
    }
  };

  request.ontimeout = () => {
    defaultHandler(request.response);
  };

  request.onerror = () => {
    defaultHandler(request.response);
  };

  let requestBody;

  if (body instanceof FormData) {
    requestBody = body;
  } else {
    requestBody = JSON.stringify(body);
  }

  request.send(requestBody);
};

/**
 * Displays a toast message after stripping any HTML from the input string.
 *
 * @param {string} string - The string to display in the toast. Any HTML will be stripped.
 * @param {string} status - The status of the toast, which affects its appearance.
 * @param {HTMLFormElement} form - The form element to append the toast to.
 */
const toastResponse = (string, status, form) => {
  const message = stripHtml(string);
  toast({ message, dismissable: true, status, parent: form });
};

/**
 * Displays a success toast message.
 *
 * @param {string} message - The message to display in the toast.
 * @param {HTMLFormElement} form - The form element to append the toast to.
 */
const toastSuccess = (request, message, form) => {
  toastResponse(message, "success", form);
};

/**
 * Displays an error toast message.
 *
 * @param {string} message - The message to display in the toast.
 * @param {HTMLFormElement} form - The form element to append the toast to.
 */
const toastError = (request, message, form) => {
  toastResponse(message, "caution", form);
};

/**
 * Displays a failure toast message.
 *
 * @param {string} message - The message to display in the toast.
 * @param {HTMLFormElement} form - The form element to append the toast to.
 */
const toastFailure = (request, message, form) => {
  toastResponse(message, "urgent", form);
};

/**
 * Sends an HTTP request using form data and handles the response.
 *
 * @param {Object} options - The options for the HTTP request.
 * @param {HTMLFormElement} options.form - The form element to get the data from.
 * @param {string} [options.successMessage] - The message to display when the request is successful.
 * @param {Function} [options.success=toastSuccess] - The function to call when the request is successful.
 * @param {string} [options.errorMessage] - The message to display when the request results in a client error.
 * @param {Function} [options.error=toastError] - The function to call when the request results in a client error.
 * @param {string} [options.failureMessage] - The message to display when the request results in a server error.
 * @param {Function} [options.failure=toastFailure] - The function to call when the request results in a server error.
 * @param {Object} [options.responseMessages={}] - An object where each key is a status code and the value is a message to display for that status.
 * @param {Object} [options.responseHandler={}] - An object where each key is a status code and the value is a function to handle that status.
 * @param {Object} [options.body={}] - An object to add to the form data.
 */
export const xhrForm = ({
  form,
  successMessage,
  success = toastSuccess,
  errorMessage,
  error = toastError,
  failureMessage,
  failure = toastFailure,
  responseMessages = {},
  responseHandler = {},
  body = {},
  reset = true,
}) => {
  // get the data from the form
  const formData = new FormData(form),
    method = form.method,
    action = form.action,
    enctype = form.enctype;

  // add the loading class to the form
  if (!form.classList.contains("loading")) {
    form.classList.add("loading");
  }

  const assignValue = (obj, keys, value) => {
    let key = keys.shift();

    if (key.includes("[")) {
      let [arrayKey, arrayIndex] = key.split("[");
      arrayIndex = parseInt(arrayIndex);

      if (!obj[arrayKey]) {
        obj[arrayKey] = [];
      }

      if (keys.length === 0) {
        obj[arrayKey][arrayIndex] = value;
      } else {
        if (!obj[arrayKey][arrayIndex]) {
          obj[arrayKey][arrayIndex] = {};
        }
        assignValue(obj[arrayKey][arrayIndex], keys, value);
      }
    } else {
      if (keys.length === 0) {
        obj[key] = value;
      } else {
        if (!obj[key]) {
          obj[key] = {};
        }
        assignValue(obj[key], keys, value);
      }
    }
  };

  formData.forEach((value, key) => {
    let keys = key.split(".");
    assignValue(body, keys, value);
  });

  // default behaviour for success
  // takes in the success message if undefined, otherwise
  // uses the request response
  const formSuccess = (request) => {
    form.classList.remove("loading");

    const message = successMessage || request.response || "Success";

    success(request, message, form, body);

    if (reset) {
      form.reset();

      const hiddenInputs = form.querySelectorAll('.field input[type="hidden"]');
      hiddenInputs.forEach((input) => {
        input.removeAttribute("value");
      });
    }

    // check to see if we have any field previews in the form
    const previews = form.querySelectorAll(".preview");

    if (previews.length > 0) {
      previews.forEach((preview) => {
        // get the image and remove the src and set to display none
        const image = preview.querySelector("img");
        image.removeAttribute("src");
        image.style.display = "none";
      });
    }
  };

  // default behavior for error
  // takes in the error message if undefined, otherwise
  // uses the request response
  const formError = (request) => {
    form.classList.remove("loading");

    const message = errorMessage || request.response || "Error";

    error(request, message, form);
  };

  // default behavior for failure
  // takes in the failure message if undefined, otherwise
  // uses the request response
  const formFailure = (request) => {
    form.classList.remove("loading");

    const message = failureMessage || request.response || "Failure";

    failure(request, message, form);
  };

  for (const [key, value] of Object.entries(responseMessages)) {
    responseHandler[key] = (request) => {
      const message = value || request.response;

      // create status (success, error, failure) from the key (200, 400 or 500)
      let status = null;

      if (key >= 200 && key < 300) {
        status = "success";
      } else if (key >= 400 && key < 500) {
        status = "caution";
      } else if (key >= 500 && key < 600) {
        status = "urgent";
      }

      toastResponse(message, status, form);
    };
  }

  const params = {
    method,
    path: action,
    body: formData,
    enctype,
    success: formSuccess,
    error: formError,
    failure: formFailure,
    responseHandler,
  };

  // and now pass this all to the xhr function
  xhr(params);
};

/**
 * Updates the App object with the response from the form request
 * @param {HTMLFormElement} form - The form element to get the data from.
 */

export const xhrFormApp = ({ form, callback, reset = true }) => {
  const success = (request) => {
    const response = JSON.parse(request.response);

    App.update(response, callback);

    closeLowestModal();
  };

  xhrForm({ form, success, reset });
};

/**
 * Updates the App object with the response from the xhr request
 * @param {Object} options - The options for the HTTP request
 */

export const xhrApp = (options, callback) => {
  const success = (request) => {
    const response = JSON.parse(request.response);

    App.update(response, callback);
  };

  options.success = success;

  xhr(options);
};

/**
 * Sends an HTTP request using form data and a reCAPTCHA token and handles the response.
 *
 * @param {Object} options - The options for the HTTP request.
 * @param {HTMLFormElement} options.form - The form element to get the data from.
 * @param {Function} [options.success=toastSuccess] - The function to call when the request is successful.
 * @param {Function} [options.error=toastError] - The function to call when the request results in a client error.
 * @param {Function} [options.failure=toastFailure] - The function to call when the request results in a server error.
 * @param {Object} [options.responseHandler={}] - An object where each key is a status code and the value is a function to handle that status.
 * @param {Object} [options.body={}] - An object to add to the form data.
 */
export const xhrFormRecaptcha = ({
  form,
  success = toastSuccess,
  error = toastError,
  failure = toastFailure,
  responseHandler = {},
  body = {},
}) => {
  const recaptchaSiteKey = form.dataset.recaptchaSiteKey;

  grecaptcha.ready(() => {
    grecaptcha
      .execute(recaptchaSiteKey, { action: "submit" })
      .then((recaptchaToken) => {
        // add a hidden input to the form with the recaptcha token
        const recaptchaInput = document.createElement("input");
        recaptchaInput.type = "hidden";
        recaptchaInput.name = "recaptchaToken";
        recaptchaInput.value = recaptchaToken;
        form.appendChild(recaptchaInput);

        xhrForm({ form, body, success, error, failure, responseHandler });
      });
  });
};

export const xhrPaginateOnScroll = (element, params) => {
  // create a scroll handler
  const scrollHandler = () => {
    // if the bottom of the page is reached, remove the event listener
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      window.removeEventListener("scroll", scrollHandler);
      element.classList.add("loadingMore");
      xhrPaginate();
    }
  };

  const xhrPaginate = () => {
    // get the page number from the element
    const page = element.dataset.page ? parseInt(element.dataset.page) : 1;

    // add it to the params body, if it exists, otherwise create the body
    if (params.body) {
      params.body.page = page;
    } else {
      params.body = { page };
    }

    // store the original success function
    const originalSuccess = params.success;

    // intercept the success function
    const success = (request) => {
      // remove the loadingMore class
      element.classList.remove("loadingMore");

      // call the original success function
      if (originalSuccess) {
        originalSuccess(request);
      }

      // parse the response
      const response = JSON.parse(request.response);

      // if there is a next page, increment the page number and register the scroll event
      if (response.nextPage) {
        element.dataset.page = response.nextPage;
        window.addEventListener("scroll", scrollHandler);
      }
    };

    // add the success function to the params
    params.success = success;

    // send the xhr request after a delay
    setTimeout(() => {
      xhr(params);
    }, 1000);
  };

  // run the xhrPaginate function initially
  xhrPaginate();
};
