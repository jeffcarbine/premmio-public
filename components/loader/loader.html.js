import { Element } from "../../template/elements.html.js";

export class Loader extends Element {
  constructor(params) {
    super(params);

    this.class = this.class ? `loader ${this.class}` : "loader";
  }
}
