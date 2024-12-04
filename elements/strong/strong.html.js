import { Element } from "../element.html.js";

export class Strong extends Element {
  constructor(params) {
    super(params);

    this.tagName = "strong";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
