// Modules
import { getCookie, setCookie } from "../../modules/cookies/cookies.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

// Components
import { openModal, closeModalClick } from "./modal.functions.js";

addEventDelegate("click", "[data-modal]", openModal, true);

addEventDelegate(
  "click",
  "dialog .modal-close, dialog .cancel",
  closeModalClick,
  true
);

/**
 * Automatically opens a modal after a specified delay.
 */
const autoModal = () => {
  console.log("checking");
  const modal = document.querySelector("dialog[data-auto='true']");

  if (modal) {
    const cookie = modal.id + "-modal",
      validCookie = getCookie(cookie);

    // check to see if we have a preventAutoModal query parameter
    const urlParams = new URLSearchParams(window.location.search),
      preventAutoModalId = urlParams.get("preventAutoModal");

    if (!validCookie && preventAutoModalId !== modal.id) {
      // wait until the user interacts with the site, then
      // display the modal after five seconds
      setTimeout(() => {
        modal.showModal();
      }, 2000);
    } else if (preventAutoModalId === modal.id) {
      setCookie(cookie, true, 365);
    }
  }
};

autoModal();
