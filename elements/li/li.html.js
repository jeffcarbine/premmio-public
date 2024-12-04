import { Element } from "../element.html.js";

export class Li extends Element {
  constructor(params) {
    super(params);

    this.tagName = "li";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
