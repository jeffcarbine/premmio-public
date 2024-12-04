import { Element } from "../element.html.js";
import { Li } from "../li/li.html.js";

export class OL extends Element {
  constructor(params) {
    super(params);

    this.tagName = "ul";
  }
}

export class Ol extends OL {
  constructor(params) {
    super(params);

    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];

      const li = new Li({ child });

      this.children[i] = li;
    }
  }
}
