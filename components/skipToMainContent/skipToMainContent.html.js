import { Span } from "../../elements/span/span.html.js";
export class SkipToMainContent {
  constructor(params) {
    this.tagName = "button";

    this.id = "skipToMainContent";

    this["data-component"] = "skipToMainContent";

    this["data-query"] = params?.target || "main";

    this.tabIndex = 0;

    this.class = "btn primary";

    this.child = new Span({
      textContent: "Skip to Main Content",
    });
  }
}
