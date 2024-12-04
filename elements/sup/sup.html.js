import { Element } from "../element.html.js";

export class Sup extends Element {
  constructor(params) {
    super(params);

    this.tagName = "sup";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
