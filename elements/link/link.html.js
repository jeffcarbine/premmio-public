import { Element } from "../element.html.js";

export class LINK extends Element {
  constructor(params) {
    super(params);
    this.tagName = "link";

    if (typeof params === "string") {
      this.href = params;
    }
  }
}

export class STYLESHEET extends LINK {
  constructor(params) {
    super(params);
    this.rel = "stylesheet";
  }
}

export class PreLoadStyle extends LINK {
  constructor(params) {
    super(params);
    this.rel = "preload";
    this.as = "style";
    this.onload = `this.rel="stylesheet"`;
  }
}
