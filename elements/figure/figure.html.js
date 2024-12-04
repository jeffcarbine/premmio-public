import { Element } from "../element.html.js";

export class Figure extends Element {
  constructor(params) {
    super(params);

    this.tagName = "figure";
  }
}

export class Figcaption extends Element {
  constructor(params) {
    super(params);

    this.tagName = "figcaption";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
