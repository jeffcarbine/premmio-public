// Elements
import { Span } from "../../template/elements.html.js";

/**
 * Class representing a button.
 */

export class Btn {
  /**
   * Creates an instance of Btn.
   *
   * @param {Object|string} params - The parameters for the button or the text content.
   */
  constructor(params) {
    // check if we have a href
    if (params.href !== undefined) {
      this.tagName = "a";
    } else {
      this.tagName = "button";
    }

    // create the span that will live inside the btn
    let span = new Span();

    // check if is object/array
    if (typeof params === "object") {
      if (Array.isArray(params)) {
        // if an array, then it's children
        span.children =
          this.children !== undefined ? this.children.concat(params) : params;
      } else {
        // otherwise, it's regular properties
        for (let key in params) {
          if (key !== "textContent" && key !== "children" && key !== "child") {
            this[key] = params[key];
          } else {
            span[key] = params[key];
          }
        }
      }
    } else {
      // if it is just a string, it is the textContent
      span.textContent = params;
    }

    // add the btn class
    this.class = this.class !== undefined ? (this.class += " btn") : "btn";

    // check if doubleUp is true
    if (params.doubleUp) {
      const hiddenSpan = new Span({ ...span, "aria-hidden": "true" });
      this.children = [span, hiddenSpan];
    } else {
      this.children = [span];
    }

    // if there is a bubble param, add the bubble span to the children after the firt span
    if (params.bubble) {
      const bubbleSpan = new Span({
        class: "bubble",
        textContent: params.bubble,
      });
      this.children.push(bubbleSpan);
    }
  }
}

/**
 * Class representing a button container.
 */
export class BtnContainer {
  /**
   * Creates an instance of BtnContainer.
   *
   * @param {Object|Array} params - The parameters for the button container or an array of buttons.
   * @param {string|null} [className=null] - The class name for the button container.
   */
  constructor(params, className = null) {
    this.class = "btn-container " + className;
    this.children = [];

    const btns = Array.isArray(params) ? params : [params];

    for (let i = 0; i < btns.length; i++) {
      const markup = btns[i],
        // only make it a new Btn if it is not already a Btn
        btn =
          markup?.class?.includes("btn") || markup?.class?.includes("moreBtn")
            ? markup
            : new Btn(markup);

      this.children.push(btn);
    }
  }
}
/**
 * Class representing a more buttons component.
 */
export class MoreBtns {
  /**
   * Creates an instance of MoreBtns.
   *
   * @param {Object} params - The parameters for the more buttons component.
   */
  constructor(params) {
    this.class = "moreBtns";

    this["data-component"] = "btn";
    this["data-xalignment"] = "";
    this["data-yalignment"] = "";

    const btns = {
      class: "btns",
      children: [],
    };

    for (let i = 0; i < params.btns.length; i++) {
      const markup = params.btns[i],
        // only make it a new Btn if it is not already a Btn
        btn = {
          class: "moreBtn",
          child: markup?.class?.includes("btn") ? markup : new Btn(markup),
        };

      btns.children.push(btn);
    }

    // create a btn out of the rest of the params except the btns value
    const btnParams = Object.assign({}, params);
    delete btnParams.btns;

    const btn = new Btn(btnParams);

    this.children = [btn, btns /*, { class: "moreBtnsOverlay" }*/];
  }
}
