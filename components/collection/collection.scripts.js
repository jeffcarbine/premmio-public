// Modules
import { xhr } from "../../modules/xhr/xhr.js";

// Local Components
import { renderTemplate } from "../../template/renderTemplate.js";

// Components
import { ProductSummary } from "../product/productSummary.html.js";

const productSummaryGrids = document.querySelectorAll(".productSummaryGrid");

productSummaryGrids.forEach((productSummaryGrid) => {
  const collectionHandle = productSummaryGrid.id;

  /**
   * Handles the success response from the XHR request.
   *
   * @param {Object} request - The XHR request object.
   */
  const fetchCollectionSuccess = (request) => {
    const products = JSON.parse(request.response).products;

    // clear out the placeholders
    productSummaryGrid.replaceChildren();

    products.forEach((product) => {
      const productSummary = renderTemplate(ProductSummary({ product }));

      productSummaryGrid.appendChild(productSummary);
    });
  };

  xhr({
    path: "/premmio/shop/collection",
    body: { collectionHandle },
    success: fetchCollectionSuccess,
  });
});
