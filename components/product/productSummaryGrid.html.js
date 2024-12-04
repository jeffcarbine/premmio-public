import { ProductSummary } from "./productSummary.html.js";

/**
 * Creates a product summary grid component.
 *
 * @param {Object} options - The options for the product summary grid.
 * @param {Array<Object>} [options.products] - The array of products to display.
 * @param {string} options.collectionHandle - The handle of the product collection.
 * @param {number} [options.count=8] - The number of products to display.
 * @param {string} [options.currency="USD"] - The currency for the product prices.
 * @param {Array<string>} [options.convertPrice=[]] - The array of currencies to convert prices to.
 * @param {boolean} [options.lg=false] - Whether to use the large grid layout.
 * @param {string} [options.url="/shop/product/"] - The URL for the product links.
 * @returns {Object} The product summary grid component configuration.
 */
export const ProductSummaryGrid = ({
  heading = 2,
  products,
  collectionHandle,
  count = 8,
  currency = "USD",
  convertPrice = [],
  lg = false,
  url = "/shop/product/",
}) => {
  /**
   * Generates placeholder elements for the product summary grid.
   *
   * @param {number} count - The number of placeholders to generate.
   * @returns {Object} The configuration for the placeholder grid.
   */
  const generatePlaceholders = (count) => {
    const placeholders = [];
    for (let i = 0; i < count; i++) {
      placeholders.push(ProductSummary({ placeholder: true }));
    }

    return {
      class: `productSummaryGrid ${lg ? "lg" : ""}`,
      "data-component": "product/productSummaryGrid",
      "data-collectionHandle": collectionHandle,
      "data-count": count,
      "data-currency": currency,
      "data-convertPrice": JSON.stringify(convertPrice),
      "data-url": url,
      "data-heading": heading,
      children: placeholders,
    };
  };

  /**
   * Generates product summary elements for the product summary grid.
   *
   * @param {Array<Object>} products - The array of products to display.
   * @returns {Object} The configuration for the product grid.
   */
  const generateProducts = (products) => {
    const productSummaries = [];

    products.forEach((product) => {
      productSummaries.push(ProductSummary({ heading, product, url }));
    });

    return {
      class: `productSummaryGrid ${lg ? "lg" : ""}`,
      children: productSummaries,
    };
  };

  // we render two different ways depending on whether or
  // not products have been passed in
  if (products) {
    return generateProducts(products);
  } else {
    return generatePlaceholders(count);
  }
};
