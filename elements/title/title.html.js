import { Element } from "../element.html.js";

export class TITLE extends Element {
  constructor(params) {
    super(params);
    this.tagName = "title";
  }
}
