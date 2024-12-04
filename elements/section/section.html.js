import { Element } from "../element.html.js";

export class Section extends Element {
  constructor(params) {
    super(params);
    this.tagName = "section";
  }
}
