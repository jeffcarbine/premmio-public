import { Ul } from "../../template/elements.html.js";

export class Paginator {
  constructor(params) {
    this["data-component"] = "paginator";
    this.class = "paginator";
    this["data-page"] = params.page || 1;
    this["data-total-pages"] = (data) => data.totalPages || 0;
    this["data-action"] = params.action;
    this["data-binding"] = params.binding;

    if (params.fields && Array.isArray(params.fields)) {
      this["data-fields"] = params.fields.join(",");
    }

    this.child = new Ul({
      children: (data, e, c) => {
        const children = [];
        const displayNumbersCount = 7;

        const isEllipsesVisible = (position, page, totalPages) => {
          const halfPageNumbers = Math.floor(displayNumbersCount / 2);

          return (
            ((page > halfPageNumbers + 2 && position === "first") ||
              (page < totalPages - halfPageNumbers - 1 &&
                position === "last")) &&
            totalPages > displayNumbersCount
          );
        };

        const isPageNumberVisible = (pageNumber, page, totalPages) => {
          const halfPageNumbers = Math.floor(displayNumbersCount / 2);
          const startPage = Math.max(1, page - halfPageNumbers);
          const endPage = Math.min(totalPages, page + halfPageNumbers);

          return (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= startPage && pageNumber <= endPage) ||
            (page <= halfPageNumbers && pageNumber <= displayNumbersCount) ||
            (page > totalPages - halfPageNumbers &&
              pageNumber > totalPages - displayNumbersCount)
          );
        };

        children.push(
          new e.Li({
            class: `previous ${data.page === 1 ? "disabled" : ""}`,
            child: new e.Button({
              "data-direction": "previous",
              "aria-label": "Previous",
              "data-page": Math.max(1, data.page - 1),
              child: new c.Icon("chevronLeft"),
            }),
          })
        );

        for (let i = 1; i <= data.totalPages; i++) {
          const liClass = i === data.page ? "active" : "";
          const li = new e.Li({
            class: liClass,
            "data-page": i,
            child: new e.A({
              role: "button",
              "data-page": i,
              textContent: i,
            }),
          });

          if (isPageNumberVisible(i, data.page, data.totalPages)) {
            li.class += " visible";
          }

          children.push(li);

          // if the first or second-to-last one, add the ellipses element
          if (i === 1 || i === data.totalPages - 1) {
            const position = i === 1 ? "first" : "last";

            children.push(
              new e.Li({
                class: `ellipses ${position} ${
                  isEllipsesVisible(position, data.page, data.totalPages)
                    ? "visible"
                    : ""
                }`,
                child: new e.Span("..."),
              })
            );
          }
        }

        children.push(
          new e.Li({
            class: `next ${data.page === data.totalPages ? "disabled" : ""}`,
            child: new e.Button({
              "data-direction": "next",
              "aria-label": "Next",
              "data-page": Math.min(data.page + 1, data.totalPages),
              child: new c.Icon("chevronRight"),
            }),
          })
        );

        return children;
      },
    });
  }
}
