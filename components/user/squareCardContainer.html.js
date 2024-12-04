// Elements
import { Span } from "../../elements/span/span.html.js";

export const SquareCardContainer = {
  id: "square-card-container",
  "data-component": "user/squareCardContainer",
  children: [
    new Span({
      textContent: "Credit Card",
    }),
    {
      id: "card-renderer",
      class: "initializing",
    },
  ],
};
