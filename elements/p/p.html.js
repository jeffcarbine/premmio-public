import { Element } from "../element.html.js";

export class P extends Element {
  constructor(params) {
    super(params);

    this.tagName = "p";

    if (typeof params !== "object") {
      this.textContent = params;
    }
  }
}
