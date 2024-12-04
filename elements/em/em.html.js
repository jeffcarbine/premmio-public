import { Element } from "../element.html.js";

export class Em extends Element {
  constructor(params) {
    super(params);

    this.tagName = "em";

    if (typeof params !== "object") {
      this.textContent = params;
    }
  }
}
