// Elements
import { Button, H2, Img, Li, Span, P } from "../../template/elements.html.js";

// Components
import { Field } from "../field/field.html.js";
import { Btn } from "../btn/btn.html.js";
import { Icon } from "../icon/icon.html.js";

// Modules
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";

/**
 * Creates a cart component.
 *
 * @returns {Object} The cart component configuration.
 */
export const Cart = (background) => {
  return {
    "data-component": "cart",
    id: "cart",
    children: [
      {
        id: "cartBody",
        children: [
          {
            id: "cartHeader",
            children: [
              new H2("Cart"),
              new Button({
                id: "cartClose",
                child: new Icon("close"),
              }),
            ],
          },
          {
            id: "cartContent",
          },
          {
            if: background,
            id: "cartBackground",
            ...background,
          },
        ],
      },
      {
        id: "cartOverlay",
      },
    ],
  };
};

/**
 * Generates the item title for the cart.
 *
 * @param {Object} item - The item object.
 * @returns {string} The generated item title.
 */
const generateItemTitle = (item) => {
  if (item.merchandise.title === "Default Title") {
    return [item.merchandise.product.title];
  }

  return [
    item.merchandise.product.title,
    new Span({ class: "variant", textContent: item.merchandise.title }),
  ];
};

/**
 * Creates the cart content template.
 *
 * @param {Object} cartData - The cart data.
 * @returns {Object} The cart content template configuration.
 */
export const cartContentTemplate = (cartData) => {
  const lineItemsData = cartData.lineItems,
    checkout = cartData.checkoutUrl,
    lineItems = [],
    pricing = [];

  // set default zero for itemCount
  let itemCount = 0;

  // loop through the lineItems
  lineItemsData.forEach((item) => {
    const lineItem = new Li({
      class: "lineItem",
      children: [
        {
          if: item.merchandise?.image,
          class: "image",
          children: [
            new Img({
              src: item.merchandise.image?.src,
            }),
          ],
        },
        new Span({
          class: "title",
          children: [
            new Span({
              children: generateItemTitle(item),
            }),
            new Span({
              class: "price",
              textContent: formatCurrency(
                item.merchandise.price__converted?.amount ||
                  item.merchandise.price.amount,
                item.merchandise.price__converted?.currencyCode ||
                  item.merchandise.price.currencyCode
              ),
            }),
          ],
        }),
        {
          class: "quantity",
          children: [
            {
              class: "center",
              children: [
                {
                  class: "quantityContainer",
                  children: [
                    new Field({
                      className: "lineItemQuantity",
                      "aria-label": "Quantity",
                      value: item.quantity,
                      "data-item-id": item.id,
                    }),
                  ],
                },
                new Button({
                  class: "deleteLineItem",
                  "aria-label": "Remove " + item.title,
                  "data-quantity": 0,
                  "data-item-id": item.id,
                  children: [new Icon("trash")],
                }),
              ],
            },
          ],
        },
      ],
    });

    lineItems.push(lineItem);

    // and add the quantity to the itemCount
    itemCount += item.quantity;
  });

  // get the cart subtotal values
  const subtotal = cartData.estimatedCost.subtotalAmount.amount,
    total = cartData.estimatedCost.totalAmount.amount,
    currencyCode = cartData.estimatedCost.subtotalAmount.currencyCode,
    discount = cartData.discountAllocations?.length
      ? cartData.discountAllocations.reduce(
          (sum, allocation) =>
            sum + parseFloat(allocation.discountedAmount.amount),
          0
        )
      : false,
    tax = cartData.estimatedCost?.totalTaxAmount?.amount;

  return {
    id: "content",
    children: [
      {
        if: itemCount === 0,
        id: "emptyCart",
        children: [
          new P("Your cart is empty."),
          new Btn({
            href: "/shop",
            textContent: "Continue Shopping",
          }),
        ],
      },
      {
        if: itemCount > 0,
        id: "lineItems",
        children: lineItems,
      },
      {
        if: itemCount > 0,
        id: "pricing",
        children: [
          {
            class: "total",
            if: discount || tax,
            children: [
              {
                class: "chipContainer",
                child: {
                  class: "chip sm",
                  textContent: "Original Price",
                },
              },
              new Span(formatCurrency(subtotal, currencyCode)),
            ],
          },
          {
            class: "tax",
            if: tax,
            children: [
              {
                class: "chipContainer",
                child: {
                  class: "chip sm",
                  textContent: "Estimated Tax",
                },
              },
              new Span(formatCurrency(tax, currencyCode)),
            ],
          },
          {
            class: "discount",
            if: discount,
            children: [
              {
                class: "chipContainer",
                child: {
                  class: "chip urgent sm",
                  textContent: "Discount",
                },
              },
              new Span(`-${formatCurrency(discount, currencyCode)}`),
            ],
          },
          {
            class: "subtotal",
            textContent: formatCurrency(total, currencyCode),
          },
        ],
      },
      {
        if: itemCount > 0,
        id: "checkout",
        children: [
          new Btn({ href: checkout, textContent: "Check Out" }),
          new P({
            if: !tax,
            class: "taxesAndShipping",
            textContent: "(Taxes and shipping are calculated at checkout)",
          }),
        ],
      },
    ],
  };
};
