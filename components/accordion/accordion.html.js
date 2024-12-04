// Elements
import { Button, Span } from "../../template/elements.html.js";

/**
 * Creates an accordion component.
 *
 * @param {Object} params - The parameters for the accordion component.
 * @param {string} [params.className=""] - The class name for the accordion.
 * @param {string} [params.id=""] - The ID for the accordion.
 * @param {string|Object} params.title - The title of the accordion.
 * @param {string} [params.action="Toggle"] - The action label for the accordion button.
 * @param {Object} [params.button={}] - The button configuration for the accordion.
 * @param {Object} params.body - The body content of the accordion.
 * @param {boolean} [params.open=false] - Whether the accordion is open by default.
 * @returns {Object} The accordion component configuration.
 */
export const Accordion = ({
  className = "",
  id = "",
  title,
  action = "Toggle",
  button = {},
  body,
  open = false,
} = {}) => {
  const accordionBody = {
    class: `accordion-body ${open ? "open" : ""}`,
    style: open ? "height: auto" : "",
    child: body,
  };

  const generateTitle = () => {
    if (typeof title === "string") {
      return new Span(title);
    } else {
      return title;
    }
  };

  const generateAccordionButton = () => {
    const accordionButton = new Button(button);

    accordionButton.class =
      accordionButton.class + ` accordion-button ${open ? "open" : ""}`;
    accordionButton["aria-label"] = action;
    accordionButton.type = "button";

    return accordionButton;
  };

  return {
    "data-component": "accordion",
    class: `accordion ${className} ${open ? "open" : ""}`,
    id,
    children: [
      {
        class: "accordion-title",
        children: [generateTitle(), generateAccordionButton()],
      },
      accordionBody,
    ],
  };
};
