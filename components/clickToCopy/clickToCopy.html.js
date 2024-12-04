// Components
import { Btn } from "../btn/btn.html.js";
import { Icon } from "../icon/icon.html.js";

/**
 * Creates a ClickToCopy component.
 *
 * @param {string} text - The text to be copied.
 * @returns {Object} The ClickToCopy component configuration.
 */
export const ClickToCopy = (text) => {
  return {
    "data-component": "clickToCopy",
    class: "clickToCopy",
    children: [
      {
        class: "text",
        child: {
          textContent: text,
        },
      },
      new Btn({
        class: "copy icon-only",
        child: new Icon("copy"),
        "data-text": text,
      }),
    ],
  };
};
