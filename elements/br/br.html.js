import { Element } from "../element.html.js";

export class BR extends Element {
  constructor(params) {
    super(params);
    this.tagName = "br";
  }
}
