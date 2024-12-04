import { Element } from "../element.html.js";

export class SVG extends Element {
  constructor(params) {
    super(params);
    this.tagName = "svg";
  }
}
