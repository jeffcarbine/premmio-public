import { Element } from "../element.html.js";

export class Form extends Element {
  constructor(params) {
    super(params);
    this.tagName = "form";
    this.method = params.method !== undefined ? params.method : "POST";
  }
}
