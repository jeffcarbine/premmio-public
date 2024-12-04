// Components
import { Icon } from "../icon/icon.html.js";

// Elements
import { Button } from "../../template/elements.html.js";

/**
 * Creates a Share button component.
 *
 * @param {Object} options - The options for the Share button.
 * @param {string} options.title - The title to share.
 * @param {string} options.url - The URL to share.
 * @param {string} [options.className=""] - Additional class names for the button.
 * @returns {Button} The Share button component.
 */
export const Share = ({ title, url, className = "" } = {}) => {
  return new Button({
    "data-component": "share",
    child: new Icon("share"),
    class: "share " + className,
    "data-title": title,
    "data-url": url,
  });
};
