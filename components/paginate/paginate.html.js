import { Icon } from "../icon/icon.html.js";
import { A, Button, Li, Span, Ul } from "../../template/elements.html.js";

export class Paginate {
  constructor(params) {
    this["data-component"] = "paginate";
    this.class = "paginate";
    this["data-page"] = params.page;
    this["data-total-pages"] = params.totalPages;
    this["data-display-numbers-count"] = params.displayNumbersCount || 7;

    const pages = [];

    for (let i = 1; i <= params.totalPages; i++) {
      pages.push(
        new Li({
          class: i === params.page ? "active" : "",
          "data-page": i,
          child: new A({
            role: "button",
            "data-page": i,
            textContent: i,
          }),
        })
      );

      // if the first one, add the ellipses element
      if (i === 1 || i === params.totalPages - 1) {
        pages.push(
          new Li({
            class: `ellipses ${i === 1 ? "first" : "last"}`,
            child: new Span("..."),
          })
        );
      }
    }

    this.child = new Ul([
      new Li({
        class: `previous ${params.page === 1 ? "disabled" : ""}`,
        child: new Button({
          "data-direction": "previous",
          "aria-label": "Previous",
          child: new Icon("chevronLeft"),
        }),
      }),
      ...pages,
      new Li({
        class: `next ${params.page === params.totalPages ? "disabled" : ""}`,
        child: new Button({
          "data-direction": "next",
          "aria-label": "Next",
          child: new Icon("chevronRight"),
        }),
      }),
    ]);
  }
}
