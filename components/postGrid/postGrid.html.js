// Components
import { dehyphenate } from "../../modules/formatString/formatString.js";
import { HiddenInput } from "../../template/elements.html.js";
import { BtnContainer } from "../btn/btn.html.js";
import { Field } from "../field/field.html.js";

export class PostGridTools {
  constructor(params) {
    const suggestionBtns = params.suggestions.map((suggestion) => {
      return {
        class: "sm",
        textContent: suggestion,
      };
    });

    let collectionInputs = [];

    if (params.collections) {
      params.collections.forEach((collection) => {
        collectionInputs.push(
          new Field({
            name: "collection",
            value: collection,
            label: dehyphenate(collection),
            type: "radio",
          })
        );
      });

      collectionInputs.unshift(
        new Field({
          name: "collection",
          value: "all",
          label: "All",
          type: "radio",
          checked: true,
        })
      );
    } else if (params.collection) {
      collectionInputs = [
        new HiddenInput({
          name: "collection",
          value: params.collection,
        }),
      ];
    }

    this.id = "postGridTools";
    this.children = [
      {
        id: "postSearch",
        child: new Field({
          id: "search",
          label: params.searchText || "Search",
          placeholder: params.placeholder || "Search...",
          type: "search",
          attributes: {
            autocomplete: "off",
          },
        }),
      },
      {
        if: params.collections,
        id: "toggleCollections",
        class: "radio-group",
        children: collectionInputs,
      },
      {
        if: params.suggestions,
        id: "suggestions",
        child: new BtnContainer(suggestionBtns, "centered"),
      },
    ];
  }
}

export class PostGridResults {
  constructor(params) {
    this.id = "postGridResults";
    this.children = [
      {
        id: "results",
        "data-component": "postGrid",
        class: "loading",
      },
      {
        id: "loadMoreBlock",
        class: "hidden",
        child: new BtnContainer(
          {
            id: "loadMore",
            textContent: "Load More",
            "data-page": 1,
            "data-descriptions": params.descriptions ?? true,
            "data-date": params.date ?? true,
            "data-first-free-reward": params.firstFreeReward ?? false,
            "data-button": params.postButton ?? true,
          },
          "centered"
        ),
      },
    ];
  }
}

export class PostGrid {
  constructor(params) {
    this.children = [new PostGridTools(params), new PostGridResults(params)];
  }
}
