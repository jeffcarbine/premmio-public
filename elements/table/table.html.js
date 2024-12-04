import { Element } from "../element.html.js";

export class Table extends Element {
  constructor(params) {
    super(params);
    this.tagName = "table";
  }
}

export class CAPTION extends Element {
  constructor(params) {
    super(params);
    this.tagName = "caption";
  }
}

export class THead extends Element {
  constructor(params) {
    super(params);
    this.tagName = "thead";

    // if the params is an array of strings, wrap each string in a TH element
    if (
      Array.isArray(params) &&
      (typeof params[0] === "string" || Array.isArray(params[0]))
    ) {
      this.children = params.map(
        (param) =>
          new TH({
            children: Array.isArray(param) ? param : [param],
          })
      );
    }
  }
}

export class TH extends Element {
  constructor(params) {
    super(params);
    this.tagName = "th";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class TR extends Element {
  constructor(params) {
    super(params);
    this.tagName = "tr";
  }
}

export class TBody extends Element {
  constructor(params) {
    super(params);
    this.tagName = "tbody";

    // if the params is an array of arrays, and the members of each of those sub arrays are strings, then wrap each secondary array in a TR element, and each string in first a TH element with a scope of row and then TD elements for the rest
    if (
      Array.isArray(params) &&
      Array.isArray(params[0]) &&
      (typeof params[0][0] === "string" || Array.isArray(params[0][0]))
    ) {
      this.children = params.map((param) => {
        const tr = new TR();
        tr.children = param.map((p, i) => {
          if (i === 0) {
            if (typeof p === "object" && !Array.isArray(p)) {
              return new TH({
                scope: "row",
                ...p,
              });
            } else {
              return new TH({
                scope: "row",
                children: Array.isArray(p) ? p : [p],
              });
            }
          } else {
            if (typeof p === "object" && !Array.isArray(p)) {
              return new TD(p);
            } else {
              return new TD({
                children: Array.isArray(p) ? p : [p],
              });
            }
          }
        });
        return tr;
      });
    }
  }
}

export class TD extends Element {
  constructor(params) {
    super(params);
    this.tagName = "td";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class TFOOT extends Element {
  constructor(params) {
    super(params);
    this.tagName = "tfoot";
  }
}
