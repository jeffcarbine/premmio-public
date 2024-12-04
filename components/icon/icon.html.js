// Elements
import { Element } from "../../template/elements.html.js";

// Components
import { icons } from "./icons.js";

/**
 * Class representing an icon.
 */
export class Icon extends Element {
  /**
   * Creates an instance of Icon.
   *
   * @param {string} iconName - The name of the icon.
   */
  constructor(params) {
    super(params);

    let iconName;

    if (params === undefined) {
      params = "questionCircle";
    }

    if (typeof params === "string") {
      iconName = params;
    } else {
      iconName = params.icon;
    }

    this.tagName = "svg";
    this.class = `icon icon-${iconName}`;
    this.viewBox = "0 0 200 200";
    this.innerHTML = icons[iconName];
  }
}
