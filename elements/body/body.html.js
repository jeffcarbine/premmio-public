import { Element } from "../element.html.js";

export class Body extends Element {
  constructor(params) {
    super(params);

    this.tagName = "body";
  }
}
