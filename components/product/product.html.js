// Modules
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";
import {
  alphaNum,
  camelize,
  removeEmptyHtmlTags,
} from "../../modules/formatString/formatString.js";

// Components
import { Slider } from "../../components/slider/slider.html.js";
import { Field } from "../field/field.html.js";
import { Icon } from "../icon/icon.html.js";
import { BtnContainer } from "../btn/btn.html.js";
import { ResponsiveImg } from "../responsiveImg/responsiveImg.html.js";
import { Chip } from "../chip/chip.html.js";

// Elements
import {
  Element,
  HiddenInput,
  H1,
  Span,
  Legend,
  Fieldset,
  Form,
  Article,
  Aside,
  Div,
  Label,
  RadioInput,
  A,
  Strong,
} from "../../template/elements.html.js";
import { determineWave } from "../../../private/routes/shop.routes.js";

// helper function to determine whether a product is pre-sale or not
const isPreSale = (product) => {
  // check for the metafield "Pre-Sale Name"
  if (
    product.metafields?.find(
      (metafield) =>
        metafield?.namespace === "custom" && metafield?.key === "pre_sale_name"
    )
  ) {
    // then check that the inventory is less than or equal to zero
    if (product.totalInventory <= 0) {
      // then check that at least one variant is available for sale
      if (product.variants.some((variant) => variant.availableForSale)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Generates the product title component
 */
export class ProductTitle extends Element {
  constructor(product) {
    super(product);

    this.id = "product__title";
    this.children = [
      new H1({
        textContent: product.title,
      }),
    ];
  }
}

/**
 * Generates the product tags component
 */
export class ProductChips extends Element {
  constructor(product) {
    let chips = [];

    // check to see if any of the chips need to be turned on

    // check for nsfw
    if (product.tags.includes("nsfw")) {
      chips.push(
        new Chip({
          class: "urgent",
          textContent: "NSFW",
        })
      );
    }

    // check for presale (if the totalInventory is 0 but availableForSale is true)
    if (isPreSale(product)) {
      chips.push(
        new Chip({
          class: "primary",
          textContent: "Pre-Sale",
        })
      );
    }

    super(product);

    this.id = "product__chips";
    this.children = chips;
  }
}

/**
 * Generates the product prices component
 */
export class ProductPrices extends Element {
  constructor(product) {
    /**
     * Generates the prices for the product variants.
     *
     * @param {Object} product - The product object.
     * @returns {Array<Object>} The array of price elements.
     */
    const generatePrices = (product) => {
      const prices = [];

      let basePrice;

      product.variants.forEach((variant, i) => {
        let onSale = false,
          soldOut = false;

        let hidden = true;

        if (variant.availableForSale === false) {
          soldOut = true;

          if (i === product.variants.length - 1 && !basePrice) {
            // then we are completely sold out, so we can show the last price
            hidden = false;
          }
        } else if (!basePrice) {
          basePrice = variant.price.amount;
          hidden = false;
        }

        if (variant.compareAtPrice) {
          onSale = variant.compareAtPrice.amount > variant.price.amount;
        }

        const variantPrice = {
          id: `price__${alphaNum(variant.id)}`,
          class: hidden ? "variantPrice hidden" : "variantPrice",
          children: [
            new Span({
              if: onSale && !soldOut,
              class: "compareAt",
              textContent: formatCurrency(
                variant.compareAtPrice?.amount,
                variant.compareAtPrice?.currencyCode
              ),
            }),
            new Span({
              if: !soldOut,
              class: `price ${onSale ? "onSale" : ""}`,
              children:
                variant.price__converted !== undefined
                  ? [
                      formatCurrency(
                        variant.price__converted.amount,
                        variant.price__converted.currencyCode
                      ),
                      {
                        class: "chip accent",
                        textContent: variant.price__converted.currencyCode,
                      },
                    ]
                  : [
                      formatCurrency(
                        variant.price.amount,
                        variant.price.currencyCode
                      ),
                    ],
            }),
            new Span({
              if: variant.price__converted !== undefined && !soldOut,
              class: "original",
              textContent: `(${formatCurrency(
                variant.price.amount,
                variant.price.currencyCode
              )} ${variant.price.currencyCode})`,
            }),
            new Span({
              if: soldOut,
              class: "soldOut",
              textContent: "Sold Out",
            }),
          ],
        };

        prices.push(variantPrice);
      });

      return prices;
    };

    super(product);

    this.id = "product__prices";
    this.children = generatePrices(product);
  }
}

/**
 * Generates the product body component
 */
export class ProductBody extends Element {
  constructor(params) {
    super(params);

    this["data-component"] = "product";
    this.id = "product__body";
    this.children = [new Aside(params.aside), new Article(params.article)];
  }
}

/**
 * Generates the product description component
 */
export class ProductDescription extends Element {
  constructor(product) {
    super(product);

    this.id = "product__description";
    this.children = [
      new Div({
        innerHTML: removeEmptyHtmlTags(product.descriptionHtml),
      }),
    ];

    if (isPreSale(product)) {
      this.children.push(
        new Div({
          id: "preSaleInfo",
          children: this.getPreSaleInfo(product),
        })
      );
    }
  }

  getPreSaleInfo(product) {
    const preSaleMetafield = product.metafields.find(
        (metafield) => metafield.key === "pre_sale_name"
      ),
      preSaleName = preSaleMetafield.value;

    const wave = determineWave(product.totalInventory);
    return [
      new Icon("information"),
      `You are purchasing a pre-sale item which will be part of the ${preSaleName} `,
      new Strong(`Wave ${wave}`),
      `. You can check delivery estimates on our `,
      new A({
        href: "/pre-order-info",
        textContent: "pre-order info page",
      }),
      ".",
    ];
  }
}

/**
 * Generates the product variants component
 */
export class ProductVariants extends Element {
  constructor(product) {
    const organizedVariants = product.organizedVariants,
      fieldsets = [];

    const createHiddenVariant = (key, variant) => {
      return new HiddenInput({
        name: "variant",
        value: variant.id,
      });
    };

    const createVariantSelect = (key, variant) => {
      const options = Object.entries(variant).map(([subkey, subvalue]) => {
        return {
          value: subvalue.id,
          "data-imageid": subvalue.image.id,
          name: subkey,
        };
      });

      return new Field({
        type: "select",
        name: "variant",
        "aria-label": key,
        options,
      });
    };

    const createVariantRadio = (key, variant) => {
      const radioData = {
        type: "fullradio",
        name: "variant",
        value: variant.id,
        id: variant.id,
        label: key,
      };

      if (variant.image?.id) {
        radioData["data-imageid"] = variant.image.id;
      }

      if (!variant.availableForSale) {
        radioData.disabled = true;
      }

      return new Field(radioData);
    };

    const createFieldset = (key, value) => {
      const fieldset = new Fieldset({
        children: [
          new Legend({
            textContent: key,
          }),
        ],
      });

      // check to see if they or their children are variants, or another group
      // we do this by looking for the id property
      if (Object.values(value)[0]?.id) {
        const subkeys = Object.keys(value);
        const longTitleCount = subkeys.filter(
          (subkey) => subkey.length > 20
        ).length;

        if (subkeys.length > 10 || (subkeys.length > 5 && longTitleCount > 5)) {
          const variantSelect = createVariantSelect(key, value);
          fieldset.children.push(variantSelect);
        } else {
          for (const subkey in value) {
            const variantRadio = createVariantRadio(subkey, value[subkey]);
            fieldset.children.push(variantRadio);
          }
        }
      } else {
        Object.entries(value).forEach(([subkey, subvalue]) => {
          fieldset.children.push(createFieldset(subkey, subvalue));
        });
      }

      return fieldset;
    };

    // Check to see if we have no nested variants
    if (
      Object.keys(organizedVariants).length === 1 &&
      Object.keys(organizedVariants[Object.keys(organizedVariants)[0]])
        .length === 1 &&
      organizedVariants[Object.keys(organizedVariants)[0]][
        Object.keys(organizedVariants[Object.keys(organizedVariants)[0]])[0]
      ]?.id
    ) {
      // Create a hidden input for the single variant
      const key = Object.keys(organizedVariants)[0];
      const nestedKey = Object.keys(organizedVariants[key])[0];
      const value = organizedVariants[key][nestedKey];
      fieldsets.push(createHiddenVariant(key, value));
    } else if (organizedVariants[Object.keys(organizedVariants)[0]]?.id) {
      // Create the fieldset with no legend and the radio buttons
      const fieldset = new Fieldset({
        children: [],
      });

      Object.entries(organizedVariants).forEach(([key, value]) => {
        const variantRadio = createVariantRadio(key, value);

        fieldset.children.push(variantRadio);
      });

      fieldsets.push(fieldset);
    } else {
      // Check to see if we only have one variant
      if (Object.keys(organizedVariants).length === 1) {
        const key = Object.keys(organizedVariants)[0];
        const value = organizedVariants[key];

        // Check if the single variant is nested two levels deep
        if (value[Object.keys(value)[0]]?.id) {
          // Create a fieldset with radio buttons for the nested variants
          const fieldset = new Fieldset({
            legend: key,
            children: [],
          });

          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            const variantRadio = createVariantRadio(nestedKey, nestedValue);

            fieldset.children.push(variantRadio);
          });

          fieldsets.push(fieldset);
        } else {
          // Create a hidden input for the single variant
          fieldsets.push(createHiddenVariant(key, value));
        }
      } else {
        // Create fieldsets for nested variants
        Object.entries(organizedVariants).forEach(([key, value]) => {
          fieldsets.push(createFieldset(key, value));
        });
      }
    }

    super(product);

    this.id = "product__variants";
    this.children = [
      ...fieldsets,
      new BtnContainer({
        id: "addToCart",
        textContent: "Add to Cart",
      }),
    ];
  }
}

/**
 * Generates the product images component
 */
export class ProductImages extends Element {
  constructor(product) {
    const images = product.images,
      slides = [],
      thumbnails = [];

    images.forEach((image) => {
      const img = new ResponsiveImg({
        src: `${image.src}&width=100`,
        src: image.src,
        src_xs: `${image.src}&width=100`,
        src_sm: `${image.src}&width=300`,
        src_md: `${image.src}&width=500`,
        src_lg: `${image.src}&width=800`,
        alt: image.talText,
      });

      slides.push({
        ...img,
        id: "imageid" + image.id.substring(image.id.lastIndexOf("/") + 1),
      });
      thumbnails.push(
        new Label({
          "aria-label": image.altText,
          children: [
            img,
            new RadioInput({
              name: "thumbnail",
              value: image.id,
            }),
          ],
        })
      );
    });

    super(product);

    this.id = "product__images";
    this["data-element-offset"] = "header";
    this["data-px-offset"] = "16";
    this["data-parent"] = "#product";

    // if there's only one image, don't make a slider
    if (slides.length === 1) {
      this.child = new Div({
        id: "singleImage",
        children: slides,
      });
    } else {
      this.children = [
        new Div({
          id: "productSlider",
          children: [Slider({ elements: slides }), new Icon("square")],
        }),
        new Div({
          id: "thumbnails",
          children: thumbnails,
        }),
      ];
    }
  }
}

/**
 * Generates the product component
 */
export class Product extends Element {
  constructor(product) {
    const tags = product.tags.map((tag) => camelize(tag)).join(" ");

    super(product);

    if (product.tags.includes("nsfw")) {
      this["data-nsfw"] = true;
      this["data-nsfw-event"] = "load";
    }

    this.id = "product";
    this.class = `product ${tags}`;
    this.children = [
      new ProductBody({
        article: [
          new ProductTitle(product),
          new ProductChips(product),
          new ProductPrices(product),
          new ProductVariants(product),
          new ProductDescription(product),
        ],
        aside: [new ProductImages(product)],
      }),
    ];
  }
}
