// Elements
import { Progress, Div } from "../../template/elements.html.js";

/**
 * Creates a progress bar component.
 *
 * @param {number} value - The value of the progress bar.
 * @param {string} [undertext] - The text to display under the progress bar.
 * @returns {Object} The progress bar component configuration.
 */
export const progressBarComponent = (value, undertext) => {
  const progressBar = {
    class: "progressBar",
    children: [
      new Progress({
        max: 100,
        value,
      }),
    ],
  };

  if (undertext) {
    progressBar.children.push(
      new Div({
        class: "undertext",
        textContent: undertext,
      })
    );
  }

  return progressBar;
};
