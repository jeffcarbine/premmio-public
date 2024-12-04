// Modules
import { createModal } from "../modal/modal.functions.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

// Components
import { ClickToCopy } from "../clickToCopy/clickToCopy.html.js";
import { Icon } from "../icon/icon.html.js";

// Elements
import { H2 } from "../../public/template/elements.html.js";

/**
 * Shares the content using the Web Share API or a fallback modal.
 *
 * @param {HTMLElement} button - The button element that triggers the share.
 */
const share = (button) => {
  const title = button.dataset.title,
    url = button.dataset.url;

  if (navigator.share) {
    navigator
      .share({
        title,
        url,
      })
      .catch(console.error);
  } else {
    createModal({
      modalBody: {
        children: [
          {
            class: "share-icon",
            child: new Icon("share"),
          },
          new H2(title),
          {
            class: "options",
            children: [],
          },
          ClickToCopy(url),
        ],
      },
      sibling: button,
      className: "share-modal",
    });
  }
};

addEventDelegate("click", "button.share", share);
