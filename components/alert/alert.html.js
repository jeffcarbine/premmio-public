// Components
import { Icon } from "../icon/icon.html.js";

// Elements
import { P } from "../../template/elements.html.js";

/**
 * Creates an alert component.
 *
 * @param {Object} params - The parameters for the alert component.
 * @param {string} [params.type="info"] - The type of the alert (e.g., info, warning, error).
 * @param {string} params.message - The message to display in the alert.
 * @param {string} [params.icon] - The icon to display in the alert.
 * @returns {Object} The alert component configuration.
 */
export const Alert = ({ type = "info", message, icon }) => {
  const children = [
    {
      class: "message",
      child: new P(message),
    },
  ];

  if (icon) {
    children.unshift(new Icon(icon));
  }

  return {
    class: `alert ${type} ${icon ? "has-icon" : ""}`,
    children,
  };
};
