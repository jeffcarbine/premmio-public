import { Span } from "../../template/elements.html.js";

export class Chip extends Span {
  constructor(params) {
    super(params);

    this.class = `chip ${this.class ?? ""}`.trim();
  }
}
