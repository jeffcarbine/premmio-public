// Modules
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";
import { camelize } from "../../modules/formatString/formatString.js";

// Components
import { ResponsiveImg } from "../responsiveImg/responsiveImg.html.js";

// Elements
import { H2, Span } from "../../template/elements.html.js";
import { Chip } from "../chip/chip.html.js";

/**
 * Creates a product summary component.
 *
 * @param {Object} options - The options for the product summary.
 * @param {Object} [options.data] - The data for the product.
 * @param {boolean} [options.placeholder=false] - Whether to display a placeholder.
 * @param {string} [options.url="/shop/product/"] - The URL for the product link.
 * @returns {Object} The product summary component configuration.
 */
export const ProductSummary = ({
  heading = 2,
  product,
  placeholder = false,
  url = "/shop/product/",
} = {}) => {
  const price = product?.variants[0].price.amount,
    compareAtPrice = product?.variants[0].compareAtPrice?.amount || price,
    currency = product?.variants[0].price.currencyCode,
    price__converted = product?.variants[0].price__converted?.amount,
    compareAtPrice__converted =
      product?.variants[0].compareAtPrice__converted?.amount,
    currency__converted = product?.variants[0].price__converted?.currencyCode;

  // check to see if any of the chips need to be turned on
  const chips = [];
  let nsfw = false;

  // check for nsfw
  if (product?.tags.includes("nsfw")) {
    nsfw = true;

    chips.push(
      new Chip({
        class: "urgent sm",
        textContent: "NSFW",
      })
    );
  }

  // check for presale (if the totalInventory is 0 but availableForSale is true)
  if (
    product?.totalInventory <= 0 &&
    product?.variants.some((variant) => variant.availableForSale)
  ) {
    chips.push(
      new Chip({
        class: "primary sm",
        textContent: "Pre-Sale",
      })
    );
  }

  return {
    tagName: placeholder ? "div" : "a",
    href: url + product?.handle || "",
    class: `productSummary ${product?.tags.join(" ")} ${
      placeholder ? "placeholder" : ""
    }`,
    target: url === "/shop/product/" ? "" : "_blank",
    "data-nsfw-event": nsfw ? "click" : "none",
    child: {
      class: "innerCard",
      children: [
        {
          class: "image",
          children: [
            new ResponsiveImg({
              if: !placeholder,
              "data-nsfw": nsfw,
              src: `${product?.images?.[0]?.src}&width=100` || "",
              src_xs: `${product?.images?.[0]?.src}&width=100`,
              src_sm: `${product?.images?.[0]?.src}&width=300`,
              src_md: `${product?.images?.[0]?.src}&width=500`,
              src_lg: `${product?.images?.[0]?.src}&width=800`,
              src: `${product?.images?.[0]?.src}&width=1000`,
              alt: product?.title,
            }),
            {
              if: placeholder,
              class: "placeholderImage",
            },
          ],
        },
        {
          class: "title",
          children: [
            {
              if: !placeholder,
              tagName: `h${heading}`,
              textContent: product?.title || "",
              append: {
                class: "chips",
                children: chips,
              },
            },
            {
              if: placeholder,
              class: "placeholderTitle",
            },
          ],
        },
        {
          if: product?.availableForSale,
          class: "pricing",
          children: [
            {
              if: !placeholder && compareAtPrice !== price,
              class: "compareAt",
              textContent: formatCurrency(
                compareAtPrice__converted || compareAtPrice,
                currency__converted || currency
              ),
            },
            // {
            //   if:
            //     !placeholder &&
            //     compareAtPrice !== price &&
            //     compareAtPrice__converted !== undefined,
            //   class: "original",
            //   textContent: `(${formatCurrency(compareAtPrice, currency)})`,
            // },
            {
              if: !placeholder,
              class: "price " + (compareAtPrice !== price ? "onSale" : ""),
              children: [
                formatCurrency(
                  price__converted || price,
                  currency__converted || currency
                ),
                {
                  if: price__converted !== undefined,
                  class: "currencyCode",
                  child: new Span({
                    class: "chip accent sm",
                    textContent: currency__converted,
                  }),
                },
              ],
            },
            {
              if: !placeholder && price__converted !== undefined,
              class: "original",
              textContent: `(${formatCurrency(price, currency)})`,
            },
            {
              if: placeholder,
              class: "placeholderPrice",
            },
          ],
        },
        {
          if: !product?.availableForSale,
          class: "pricing",
          child: {
            if: !placeholder,
            class: "soldOut",
            textContent: "Sold Out",
          },
        },
      ],
    },
  };
};
