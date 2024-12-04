// Elements
import { Button, Span } from "../../template/elements.html.js";

/**
 * Class representing a navigation toggle button.
 *
 * @extends Button
 */

export class NavToggle extends Button {
  /**
   * Creates an instance of NavToggle.
   *
   * @param {Object} [params={}] - The parameters for the navigation toggle button.
   */
  constructor(params = {}) {
    super(params);
    this["data-component"] = "navToggle";
    this.id = "navToggle";
    this["aria-label"] = "Toggle Navigation";
    this["data-target"] = params["data-target"] || "#navigation";

    if (!params.children) {
      this.children = [new Span(), new Span(), new Span()];
    }
  }
}
