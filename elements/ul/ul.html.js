import { Element } from "../element.html.js";
import { Li } from "../li/li.html.js";

export class Ul extends Element {
  constructor(params) {
    super(params);

    this.tagName = "ul";
  }
}

export class UlLi extends Ul {
  constructor(params) {
    super(params);

    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];

      // change how we pass the data to the li
      let data = child;

      if (typeof child === "object" && !Array.isArray(child)) {
        data = { child };
      }

      const li = new Li(data);

      this.children[i] = li;
    }
  }
}
