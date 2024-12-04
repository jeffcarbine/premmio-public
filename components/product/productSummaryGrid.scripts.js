// Modules
import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";

// Components
import { ProductSummary } from "./productSummary.html.js";

// Elements
import { H2, P } from "../../template/elements.html.js";

const productSummaryGrids = document.querySelectorAll(".productSummaryGrid");

productSummaryGrids.forEach((productSummaryGrid) => {
  const collectionHandle = productSummaryGrid.dataset.collectionhandle,
    count = productSummaryGrid.dataset.count,
    url = productSummaryGrid.dataset.url,
    heading = productSummaryGrid.dataset.heading;

  /**
   * Handles the success response from the XHR request.
   *
   * @param {Object} request - The XHR request object.
   */
  const success = (request) => {
    const products = JSON.parse(request.response).products;

    // clear out the placeholders
    productSummaryGrid.replaceChildren();

    if (products.length > 0) {
      products.forEach((product) => {
        const productSummary = renderTemplate(
          ProductSummary({
            heading,
            product,
            url,
          })
        );
        productSummaryGrid.appendChild(productSummary);
      });
    } else {
      const noProducts = renderTemplate({
        class: "noProducts",
        children: [
          new H2("No products found"),
          new P("Please check back later!"),
        ],
      });

      productSummaryGrid.appendChild(noProducts);
    }
  };

  xhr({
    path: "/premmio/shop/collection",
    body: { collectionHandle, count },
    success,
  });
});
