import { Element } from "../element.html.js";

export class Script extends Element {
  constructor(params) {
    super(params);

    this.tagName = "script";
    this.defer = true;

    if (typeof params === "string") {
      this.src = params;
    }
  }
}

export class Module extends Script {
  constructor(params) {
    super(params);

    this.type = "module";
  }
}
