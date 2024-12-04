import { Div } from "../../template/elements.html.js";
import { Field } from "../field/field.html.js";
import { PremiumCollectionList } from "../premiumCollectionList/premiumCollectionList.html.js";

export class PremiumPostFeed extends Div {
  constructor(params) {
    super(params);

    this["data-component"] = "premiumPostFeed";

    this.children = [
      new Div({
        id: "controls",
        children: [
          new Div({
            child: new Field({
              id: "search",
              type: "search",
              "aria-label": "Search",
              placeholder: "Search",
            }),
          }),
        ],
      }),
      new Div({
        id: "collections",
        child: PremiumCollectionList(params.collections),
      }),
      new Div({
        id: "feed",
        class: "loading",
      }),
    ];
  }
}
