// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

// Components
import { toast } from "../alert/alert.js";

/**
 * Copies text to the clipboard and shows a toast notification.
 *
 * @param {HTMLElement} button - The button element that triggers the copy action.
 */
export const clickToCopy = async (button) => {
  const text = button.dataset.text,
    parent = button.parentNode;

  button.classList.add("loading");

  try {
    await navigator.clipboard.writeText(text);
    button.classList.remove("loading");
    toast({
      message: "Copied to clipboard!",
      parent,
      small: true,
      status: "success",
    });
  } catch (err) {
    button.classList.remove("loading");
    toast({
      message: "Failed to copy: " + err,
      parent,
      small: true,
      status: "error",
    });
  }
};

addEventDelegate("click", ".clickToCopy .copy", clickToCopy);
