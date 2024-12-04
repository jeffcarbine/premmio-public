import { Element } from "../element.html.js";

export class Img extends Element {
  constructor(params) {
    super(params);

    this.tagName = "img";

    if (typeof params === "string") {
      this.src = params;
    }
  }
}

export class LazyImg extends Img {
  constructor(params) {
    super(params);

    this.loading = "lazy";
  }
}
