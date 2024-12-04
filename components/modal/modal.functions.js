// Components
import { Modal } from "./modal.html.js";

// Modules
import { renderTemplate } from "../../template/renderTemplate.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { getCookie, setCookie } from "../../modules/cookies/cookies.js";

/**
 * Creates a modal and appends it after the specified sibling element.
 *
 * @param {Object} options - The options for creating the modal.
 * @param {Object} options.modalBody - The content of the modal.
 * @param {HTMLElement} options.sibling - The sibling element to append the modal after.
 * @param {string} [options.className=""] - Additional class names for the modal.
 * @param {string} [options.id=""] - The ID of the modal.
 */
export const createModal = ({
  modalBody,
  sibling,
  className = "",
  id = "",
} = {}) => {
  const newModal = renderTemplate(Modal({ modalBody, className, id }));

  sibling.after(newModal);

  newModal.showModal();

  addEventDelegate("click", "dialog .modal-close", destroyModal);
};

/**
 * Destroys the modal by removing it from the DOM.
 *
 * @param {HTMLElement} button - The button element that triggers the modal destruction.
 */
const destroyModal = (button) => {
  const modal = button.closest("dialog");

  modal.remove();
};

/**
 * Closes the modal and optionally redirects to a specified URL.
 *
 * @param {HTMLElement} modal - The modal element to close.
 * @param {string} [href] - The URL to redirect to after closing the modal.
 */
export const closeModal = (modal, href) => {
  // if data-modal is true, set a cookie
  if (modal.dataset.auto === "true") {
    const cookie = modal.id + "-modal";

    setCookie(cookie, true, 365);
  }

  // and if we have a href, send the user to that url
  if (href) {
    // if a full url is provided, go to that url
    if (href.includes("http")) {
      window.location.href = href;
    } else {
      // otherwise, go to the url relative to the current page
      window.location.href =
        window.location.href.split("/").slice(0, -1).join("/") + href;
    }
  } else {
    // add a class that triggers an animation
    modal.classList.add("closing");

    // check to see if a parent modal exists and has a class of hidden
    const parentModal = modal.closest("dialog.hidden");

    // if it does, remove the class
    if (parentModal) {
      parentModal.classList.remove("hidden");
    }

    // get the animation duration from the css
    const duration = parseFloat(
      window.getComputedStyle(modal).getPropertyValue("animation-duration")
    );

    // after the animation duration
    setTimeout(() => {
      // close the modal
      modal.close();

      // remove the class
      modal.classList.remove("closing");
    }, duration * 1000);
  }
};

/**
 * Closes all open modals.
 */
export const closeAllModals = () => {
  const modals = document.querySelectorAll("dialog[open]");

  modals.forEach((modal) => {
    closeModal(modal);
  });
};

/**
 * Closes the lowest modal in the stack
 */
export const closeLowestModal = () => {
  const modals = document.querySelectorAll("dialog[open]");

  if (modals.length > 1) {
    closeModal(modals[modals.length - 1]);
  } else {
    closeModal(modals[0]);
  }
};

/**
 * Closes the modal when a button is clicked and optionally redirects.
 *
 * @param {HTMLElement} button - The button element that triggers the modal close.
 */
export const closeModalClick = (button) => {
  const modal = button.closest("dialog"),
    href = button.href;

  if (href) {
    closeModal(modal, href);
  } else {
    closeModal(modal);
  }
};

/**
 * Opens a modal based on the button's data-modal attribute.
 *
 * @param {HTMLElement} button - The button element that triggers the modal open.
 */
export const openModal = (button) => {
  // first, check to see if there is another modal already open
  const modalId = button.dataset.modal,
    modal = document.querySelector("#" + modalId);

  modal.showModal();
};
