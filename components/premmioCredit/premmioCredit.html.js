import { A, Element, Span } from "../../template/elements.html.js";
import { PremmioIconStroke } from "../../../private/components/logos/icon.html.js";
import { PremmioLogo } from "../../../private/components/logos/logo.html.js";

export class PremmioCredit extends Element {
  constructor(params) {
    super(params);

    this["data-component"] = "premmioCredit";

    this.children = [
      {
        class: "premmioLogo",
        "data-vclass": "animated",
        children: [new PremmioIconStroke(), new PremmioLogo()],
      },
      {
        class: "message",
        child: new Span({
          class: "message",
          children: Array.isArray(params.message)
            ? params.message
            : [params.message],
        }),
      },
    ];
  }
}
