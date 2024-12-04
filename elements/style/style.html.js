import { Element } from "../element.html.js";

export class STYLE extends Element {
  constructor(params) {
    super(params);

    this.tagName = "style";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
