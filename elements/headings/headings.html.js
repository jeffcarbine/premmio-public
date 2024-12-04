import { Element } from "../element.html.js";

export class H1 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h1";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H2 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h2";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H3 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h3";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H4 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h4";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H5 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h5";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H6 extends Element {
  constructor(params) {
    super(params);
    this.tagName = "h5";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class Hgroup extends Element {
  constructor(params) {
    super(params);

    this.tagName = "hgroup";

    this.children = [
      // appropriate heading element via the h parameter (1 - 6)
      {
        tagName: `h${params.h}`,
        textContent: params.textContent,
      },
    ];

    // delete the textContent property so it doesn't get added to the hgroup again
    delete this.textContent;

    // if there is a subheading, add it to the hgroup
    if (params.subheading) {
      this.children.push({
        tagName: "p",
        "data-subheading": `h${params.h}`,
        textContent: params.subheading,
      });

      // then remove the subheading property so it doesn't get added to the hgroup again
      delete params.subheading;
    }

    // if there is a preheading, add it to the hgroup
    if (params.preheading) {
      this.children.unshift({
        tagName: "p",
        "data-preheading": `h${params.h}`,
        textContent: params.preheading,
      });

      // then remove the preheading property so it doesn't get added to the hgroup again
      delete params.preheading;
    }
  }
}
