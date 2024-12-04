// Elements
import { H1, P, Article, Section } from "../../template/elements.html.js";

// Components
import { ProductSummaryGrid } from "../product/productSummaryGrid.html.js";

/**
 * Creates a collection component.
 *
 * @param {Object} data - The data for the collection.
 * @param {number} [count=8] - The number of products to display.
 * @returns {Object} The collection component configuration.
 */
export const COLLECTION = (data, count = 8) => {
  const collection = data.collection;

  return {
    id: "collection",
    "data-component": "collection",
    children: [
      new Section({
        class: "collection-title",
        children: [new H1(data.title), new e.P(collection.description)],
      }),
      new Section({
        child: new Article({
          class: "collection",
          child: ProductSummaryGrid({ products: collection.products }),
        }),
      }),
    ],
  };
};
