import { Element } from "../element.html.js";

export class Button extends Element {
  constructor(params) {
    super(params);
    this.tagName = "button";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
