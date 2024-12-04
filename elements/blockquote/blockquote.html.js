import { Element } from "../element.html.js";

export class Blockquote extends Element {
  constructor(params) {
    super(params);
    this.tagName = "blockquote";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
