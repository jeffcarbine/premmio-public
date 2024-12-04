// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { alphaNum } from "../../modules/formatString/formatString.js";
import { pxPastTheTop } from "../../modules/pxPastTheTop/pxPastTheTop.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { setCartToLoading, update } from "../cart/cart.scripts.js";

const images = document.querySelector("#product__images");
pxPastTheTop(images);

/**
 * Adds a product to the cart.
 *
 * @param {HTMLElement} button - The button element that triggers the add to cart.
 */
const addToCart = (button) => {
  setCartToLoading();

  button.classList.add("loading");

  // Determine the variant element
  const variantSelect = document.querySelector("select[name='variant']");
  const variantInputChecked = document.querySelector(
    "input[name='variant']:checked"
  );
  const variantInput = document.querySelector("input[name='variant']");

  const variant = variantSelect || variantInputChecked || variantInput;

  const variantId = variant.value;

  /**
   * Handles the success response from the XHR request.
   *
   * @param {Object} request - The XHR request object.
   */
  const success = (request) => {
    const cartToggle = document.querySelector("#cartToggle");
    cartToggle.click();

    button.classList.remove("loading");
    update(request);
  };

  // get discount code from query parameters, if any
  const urlParams = new URLSearchParams(window.location.search),
    discountCode = urlParams.get("discountCode");

  const data = {
    path: "/premmio/shop/add-to-cart",
    body: { variantId },
    success,
  };

  if (discountCode) {
    data.body.discountCode = discountCode;
  }

  xhr(data);
};

addEventDelegate("click", "#addToCart", addToCart);

/**
 * Highlights the product information based on the image and variant IDs.
 *
 * @param {string|null} imageId - The ID of the product image.
 * @param {string|null} variantId - The ID of the product variant.
 */
const highlightProductInfo = (imageId, variantId) => {
  if (imageId !== null) {
    // format the imageId from the shopify gid:// to the actual image id prefixed with 'imageid'
    imageId = "imageid" + imageId.substring(imageId.lastIndexOf("/") + 1);

    // find the variant's image
    const productImage = document.querySelector("#" + imageId);

    if (productImage !== null) {
      const productImageIndex = productImage.parentNode.dataset.index;

      // find the slider element
      const slides = document.querySelector(".slider .slides");

      if (slides !== null) {
        // set the slider to that active slide
        slides.dataset.active = productImageIndex;
      }
    }
  }

  if (variantId !== null && variantId !== undefined) {
    // find the variant's price, if any
    const productPrice = document.querySelector(
      "#price__" + alphaNum(variantId)
    );

    if (productPrice) {
      // hide the visible price
      const visiblePrice = document.querySelector(".variantPrice:not(.hidden)");

      if (visiblePrice) {
        visiblePrice.classList.add("hidden");
      }

      // show the variant's price
      productPrice.classList.remove("hidden");
    }
  }
};

/**
 * Highlights the product information based on the selected radio button.
 *
 * @param {HTMLInputElement} radio - The radio input element.
 */
const highlightProductInfoRadio = (radio) => {
  const imageid = radio.dataset.imageid,
    variantId = radio.value;

  highlightProductInfo(imageid, variantId);

  // we also want to uncheck any of the thumbnails
  const thumbnails = document.querySelectorAll(
    "#thumbnails input[name='thumbnail']"
  );
  thumbnails.forEach((thumbnail) => {
    thumbnail.checked = false;
  });
};

addEventDelegate(
  "input",
  ".fullradio-field input[name='variant']",
  highlightProductInfoRadio
);

/**
 * Highlights the product image based on the selected thumbnail
 *
 * @param {HTMLInputElement} radio - The radio input element.
 */
const highlightProductInfoThumbnail = (radio) => {
  const imageid = radio.value;

  highlightProductInfo(imageid);
};

addEventDelegate(
  "input",
  "#thumbnails input[name='thumbnail']",
  highlightProductInfoThumbnail
);

/**
 * Highlights the product information based on the selected option in a select element.
 *
 * @param {HTMLSelectElement} select - The select element.
 */
const highlightProductInfoSelect = (select) => {
  const imageid = select.options[select.selectedIndex].dataset.imageid,
    variantId = select.value;

  highlightProductInfo(imageid, variantId);
};

addEventDelegate(
  "change",
  ".select-field select[name='variant']",
  highlightProductInfoSelect
);
