import { Element } from "../element.html.js";

export class Dialog extends Element {
  constructor(params) {
    super(params);
    this.tagName = "dialog";
  }
}
