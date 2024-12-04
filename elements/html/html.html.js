import { Head } from "../head/head.html.js";
import { Body } from "../body/body.html.js";

export class HTML {
  constructor(params) {
    this.tagName = "html";
    this.lang = params.lang || "en";

    if (params.style) {
      this.style = params.style;
    }

    if (params["data-theme"] !== undefined) {
      this["data-theme"] = params["data-theme"];
    }

    this.children = [new HEAD(params.head), new Body(params.body)];
  }
}
