import { Element } from "../element.html.js";

export class Pre extends Element {
  constructor(params) {
    super(params);

    this.tagName = "pre";
  }
}
