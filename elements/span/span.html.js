import { Element } from "../element.html.js";

export class Span extends Element {
  constructor(params) {
    super(params);

    this.tagName = "span";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
