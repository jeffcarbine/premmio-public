import { Element } from "../element.html.js";

export class A extends Element {
  constructor(params) {
    super(params);

    this.tagName = "a";
  }
}
