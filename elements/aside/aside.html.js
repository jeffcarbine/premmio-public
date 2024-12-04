import { Element } from "../element.html.js";

export class Aside extends Element {
  constructor(params) {
    super(params);
    this.tagName = "aside";
  }
}
