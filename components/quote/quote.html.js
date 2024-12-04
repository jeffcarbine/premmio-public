// Components
import { ResponsiveImg } from "../responsiveImg/responsiveImg.html.js";

// Elements
import { Blockquote, P } from "../../template/elements.html.js";

/**
 * Creates a quote block component.
 *
 * @param {Object} options - The options for the quote block.
 * @param {string} options.quote - The quote text.
 * @param {string|Array<string>} [options.author] - The author of the quote.
 * @param {Object} [options.image] - The image associated with the quote.
 * @returns {Object} The quote block component configuration.
 */
export const Quote = ({ quote, author, image } = {}) => {
  const quoteblock = {
    class: "quote",
    children: [
      {
        class: "quoteContent",
        children: [
          new Blockquote({
            innerHTML: quote,
          }),
          new P({
            if: author,
            class: "author",
            children: Array.isArray(author) ? author : [author],
          }),
        ],
      },
    ],
  };

  if (image) {
    quoteblock.children.unshift({
      class: "quoteImage",
      child: new ResponsiveImg(image),
    });
  }

  return quoteblock;
};
