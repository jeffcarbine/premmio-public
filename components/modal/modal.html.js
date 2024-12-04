// Elements
import { Dialog, Button, Span } from "../../template/elements.html.js";

// Components
import { Icon } from "../icon/icon.html.js";

/**
 * Creates a modal component.
 *
 * @param {Object} options - The options for the modal component.
 * @param {Object} [options.modalBody={}] - The content of the modal.
 * @param {string} [options.modalTitle] - The title of the modal.
 * @param {string} [options.id=""] - The ID of the modal.
 * @param {string} [options.className=""] - Additional class names for the modal.
 * @param {boolean} [options.auto=false] - Whether the modal should auto-open.
 * @param {boolean} [options._if=true] - Conditional rendering flag.
 * @returns {Dialog} The modal component.
 */
export const Modal = ({
  modalBody = {},
  modalTitle,
  id = "",
  className = "",
  auto = false,
  _if = true,
} = {}) => {
  return new Dialog({
    if: _if,
    "data-component": "modal",
    "data-auto": auto,
    class: "modal " + className,
    id,
    child: {
      class: "modal-container",
      children: [
        new Button({
          class: "modal-close",
          "aria-label": "Close Modal",
          children: [new Icon("close")],
        }),
        {
          if: modalTitle,
          class: "modal-title",
          child: new Span({
            textContent: modalTitle,
          }),
        },
        {
          class: "modal-content",
          child: modalBody,
        },
      ],
    },
  });
};
