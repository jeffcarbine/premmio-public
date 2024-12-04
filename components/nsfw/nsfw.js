// Modules
import { setCookie, getCookie } from "../../modules/cookies/cookies.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

// Components
import { createModal } from "../modal/modal.functions.js";
import { BtnContainer } from "../btn/btn.html.js";

// Elements
import { H2, P } from "../../template/elements.html.js";

/**
 * Checks the NSFW cookie and updates the body class accordingly.
 */
const checkNsfw = () => {
  const nsfwCookie = getCookie("nsfw") || false;

  if (nsfwCookie) {
    document.body.classList.remove("nsfw-disallowed");
    document.body.classList.add("nsfw-allowed");
  } else {
    document.body.classList.add("nsfw-disallowed");
    document.body.classList.remove("nsfw-allowed");

    // check for any nsfw-event: load elements
    const nsfwElements = document.querySelectorAll(
      "[data-nsfw='true'][data-nsfw-event='load']"
    );

    if (nsfwElements.length > 0) {
      showNsfwModal(true);
    }
  }
};

/**
 * Shows the NSFW modal if the NSFW cookie is not set.
 *
 * @param {boolean} [redirect=false] - Whether to redirect after showing the modal.
 */
const showNsfwModal = (redirect = false) => {
  const nsfwCookie = getCookie("nsfw") || false;

  // if the cookie is false, show the modal
  if (!nsfwCookie) {
    // show modal
    createModal({
      modalBody: {
        children: [
          new H2("NSFW Content"),
          new P(
            "This content is only suitable for 18+. Please confirm you are over 18 to view this content."
          ),
          new BtnContainer([
            {
              class: "confirm",
              textContent: "Yes, I am over 18",
            },
            {
              class: "deny",
              "data-redirect": redirect,
              textContent: "No, I am not over 18",
            },
          ]),
        ],
      },
      sibling: document.body,
      id: "nsfwModal",
    });
  }
};

/**
 * Sets the NSFW cookie based on the button clicked.
 *
 * @param {HTMLElement} button - The button element that was clicked.
 */
const setNsfwCookie = (button) => {
  const isOver18 = button.classList.contains("confirm");

  // set the cookie
  setCookie("nsfw", isOver18, 30);

  if (isOver18) {
    // set the nsfw-allowed class on the body
    document.body.classList.add("nsfw-allowed");
    document.body.classList.remove("nsfw-disallowed");
  } else {
    // if the user is not over 18, redirect to the home page
    const redirect = button.dataset.redirect;

    if (redirect === "true") {
      window.location.href = "/";
    }
  }

  // hide the modal
  const modal = document.querySelector("#nsfwModal");
  modal.close();
};

/**
 * Delegates the NSFW check and event listeners.
 */
export const delegate = () => {
  checkNsfw();

  addEventDelegate(
    "click",
    "body.nsfw-disallowed [data-nsfw-event='click']",
    showNsfwModal,
    true
  );

  addEventDelegate("click", "#nsfwModal button", setNsfwCookie);
};
