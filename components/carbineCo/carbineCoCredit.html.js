// Elements
import { Span, A } from "../../template/elements.html.js";

// Components
import {
  carbineCoLogoComponent,
  CCOIcon,
  CCOLogo,
} from "./carbineCoLogo.html.js";

/**
 * Creates a Carbine Co. credit component.
 *
 * @param {Object} options - The options for the credit component.
 * @param {string|null} [options.before=null] - The text before the link.
 * @param {string} [options.link="Jeff Carbine"] - The link text.
 * @param {string} [options.after=" built this website"] - The text after the link.
 * @returns {Object} The Carbine Co. credit component configuration.
 */
export const CCoCredit = ({
  before = null,
  link = "Jeff Carbine",
  after = " built this website",
} = {}) => {
  return {
    id: "ccoCredit",
    children: [
      CCOIcon,
      {
        class: "text",
        child: new Span({
          children: [
            new Span({
              if: before !== null,
              textContent: before,
            }),
            new A({
              href: "https://carbine.co",
              target: "_blank",
              textContent: link,
            }),
            new Span({
              if: after !== null,
              textContent: after,
            }),
          ],
        }),
      },
    ],
  };
};

/**
 * Creates a Carbine Co. credit component with a different class.
 *
 * @param {Object} options - The options for the credit component.
 * @param {string|null} [options.before=null] - The text before the link.
 * @param {string} [options.link="Jeff Carbine"] - The link text.
 * @param {string} [options.after=" built this website"] - The text after the link.
 * @returns {Object} The Carbine Co. credit component configuration.
 */
export const carbineCoCreditComponent = ({
  before = null,
  link = "Jeff Carbine",
  after = " built this website",
} = {}) => {
  return {
    class: "carbine-co-credit",
    children: [
      carbineCoLogoComponent,
      {
        class: "text",
        child: new Span({
          children: [
            new Span({
              if: before !== null,
              textContent: before,
            }),
            new A({
              href: "https://carbine.co",
              target: "_blank",
              textContent: link,
            }),
            new Span({
              if: after !== null,
              textContent: after,
            }),
          ],
        }),
      },
    ],
  };
};
