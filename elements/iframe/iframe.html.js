import { Element } from "../element.html.js";

export class Iframe extends Element {
  constructor(params) {
    super(params);

    this.tagName = "iframe";

    if (typeof params === "") {
      delete this.textContent;
      this.src = params;
    }
  }
}
