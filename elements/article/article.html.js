import { Element } from "../element.html.js";

export class Article extends Element {
  constructor(params) {
    super(params);
    this.tagName = "article";
  }
}
