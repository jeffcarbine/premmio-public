import { Element } from "../element.html.js";

export class Header extends Element {
  constructor(params) {
    super(params);

    this.tagName = "header";
  }
}
