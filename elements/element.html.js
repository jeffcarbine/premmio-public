const validAttributes = [
  "accept",
  "accept-charset",
  "accesskey",
  "action",
  "align",
  "alt",
  "async",
  "autocapitalize",
  "autocomplete",
  "autofocus",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "buffered",
  "challenge",
  "charset",
  "checked",
  "cite",
  "class",
  "code",
  "codebase",
  "color",
  "cols",
  "colspan",
  "content",
  "contenteditable",
  "contextmenu",
  "controls",
  "coords",
  "crossorigin",
  "data",
  "datetime",
  "decoding",
  "default",
  "defer",
  "dir",
  "dirname",
  "disabled",
  "download",
  "draggable",
  "dropzone",
  "enctype",
  "for",
  "form",
  "formaction",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "http-equiv",
  "icon",
  "id",
  "importance",
  "integrity",
  "ismap",
  "itemprop",
  "keytype",
  "kind",
  "label",
  "lang",
  "language",
  "loading",
  "list",
  "loop",
  "low",
  "manifest",
  "max",
  "maxlength",
  "minlength",
  "media",
  "method",
  "min",
  "multiple",
  "muted",
  "name",
  "novalidate",
  "open",
  "optimum",
  "pattern",
  "ping",
  "placeholder",
  "poster",
  "preload",
  "radiogroup",
  "readonly",
  "referrerpolicy",
  "rel",
  "required",
  "reversed",
  "rows",
  "rowspan",
  "sandbox",
  "scope",
  "scoped",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "spellcheck",
  "src",
  "srcdoc",
  "srclang",
  "srcset",
  "start",
  "step",
  "style",
  "summary",
  "tabindex",
  "target",
  "title",
  "translate",
  "type",
  "usemap",
  "value",
  "width",
  "wrap",

  // ARIA attributes
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",

  // htmljs specific attributes
  "if",
  "child",
  "children",
  "textContent",
  "innerHTML",
  "bind",
];

export class Element {
  constructor(params) {
    // we allow other classes to define what they do
    // with non-object params
    if (typeof params === "object") {
      if (Array.isArray(params)) {
        // if an array, then it's children
        this.children =
          this.children !== undefined ? this.children.concat(params) : params;
      } else {
        // otherwise, it's regular properties
        for (let key in params) {
          if (validAttributes.includes(key) || key.startsWith("data-")) {
            this[key] = params[key];
          }
        }
      }
    } else if (typeof params === "string" || typeof params === "function") {
      // behave differently depending on element
      switch (params.tagName) {
        case "img":
        case "script":
          this.src = params;
          break;
        case "link":
          this.href = params;
          break;
        default:
          this.textContent = params;
      }
    }
  }
}

export class Html extends Element {
  constructor(params) {
    params.tagName = "html";
    super();
  }
}

export class Base extends Element {
  constructor(params) {
    params.tagName = "base";
    super();
  }
}

export class Head extends Element {
  constructor(params) {
    params.tagName = "head";
    super();
  }
}

export class Link extends Element {
  constructor(params) {
    params.tagName = "link";
    super();
  }
}

export class Meta extends Element {
  constructor(params) {
    params.tagName = "meta";
    super();
  }
}

export class Style extends Element {
  constructor(params) {
    params.tagName = "style";
    super();
  }
}

export class Title extends Element {
  constructor(params) {
    params.tagName = "title";
    super();
  }
}

export class Body extends Element {
  constructor(params) {
    params.tagName = "body";
    super();
  }
}

export class Address extends Element {
  constructor(params) {
    params.tagName = "address";
    super();
  }
}

export class Article extends Element {
  constructor(params) {
    params.tagName = "article";
    super();
  }
}

export class Aside extends Element {
  constructor(params) {
    params.tagName = "aside";
    super();
  }
}

export class Footer extends Element {
  constructor(params) {
    params.tagName = "footer";
    super();
  }
}

export class Header extends Element {
  constructor(params) {
    params.tagName = "header";
    super();
  }
}

export class H1 extends Element {
  constructor(params) {
    params.tagName = "h1";
    super();
  }
}

export class H2 extends Element {
  constructor(params) {
    params.tagName = "h2";
    super();
  }
}

export class H3 extends Element {
  constructor(params) {
    params.tagName = "h3";
    super();
  }
}

export class H4 extends Element {
  constructor(params) {
    params.tagName = "h4";
    super();
  }
}

export class H5 extends Element {
  constructor(params) {
    params.tagName = "h5";
    super();
  }
}

export class H6 extends Element {
  constructor(params) {
    params.tagName = "h6";
    super();
  }
}

export class Hgroup extends Element {
  constructor(params) {
    params.tagName = "hgroup";
    super();
  }
}

export class Main extends Element {
  constructor(params) {
    params.tagName = "main";
    super();
  }
}

export class Nav extends Element {
  constructor(params) {
    params.tagName = "nav";
    super();
  }
}

export class Section extends Element {
  constructor(params) {
    params.tagName = "section";
    super();
  }
}

export class Blockquote extends Element {
  constructor(params) {
    params.tagName = "blockquote";
    super();
  }
}

export class Dd extends Element {
  constructor(params) {
    params.tagName = "dd";
    super();
  }
}

export class Div extends Element {
  constructor(params) {
    params.tagName = "div";
    super();
  }
}

export class Dl extends Element {
  constructor(params) {
    params.tagName = "dl";
    super();
  }
}

export class Dt extends Element {
  constructor(params) {
    params.tagName = "dt";
    super();
  }
}

export class Figcaption extends Element {
  constructor(params) {
    params.tagName = "figcaption";
    super();
  }
}

export class Figure extends Element {
  constructor(params) {
    params.tagName = "figure";
    super();
  }
}

export class Hr extends Element {
  constructor(params) {
    params.tagName = "hr";
    super();
  }
}

export class Li extends Element {
  constructor(params) {
    params.tagName = "li";
    super();
  }
}

export class Menu extends Element {
  constructor(params) {
    params.tagName = "menu";
    super();
  }
}

export class Ol extends Element {
  constructor(params) {
    params.tagName = "ol";
    super();
  }
}

export class P extends Element {
  constructor(params) {
    params.tagName = "p";
    super();
  }
}

export class Pre extends Element {
  constructor(params) {
    params.tagName = "pre";
    super();
  }
}

export class Ul extends Element {
  constructor(params) {
    params.tagName = "ul";
    super();
  }
}

export class A extends Element {
  constructor(params) {
    params.tagName = "a";
    super();
  }
}

export class Abbr extends Element {
  constructor(params) {
    params.tagName = "abbr";
    super();
  }
}

export class B extends Element {
  constructor(params) {
    params.tagName = "b";
    super();
  }
}

export class Bdi extends Element {
  constructor(params) {
    params.tagName = "bdi";
    super();
  }
}

export class Bdo extends Element {
  constructor(params) {
    params.tagName = "bdo";
    super();
  }
}

export class Br extends Element {
  constructor(params) {
    params.tagName = "br";
    super();
  }
}

export class Cite extends Element {
  constructor(params) {
    params.tagName = "cite";
    super();
  }
}

export class Code extends Element {
  constructor(params) {
    params.tagName = "code";
    super();
  }
}

export class Data extends Element {
  constructor(params) {
    params.tagName = "data";
    super();
  }
}

export class Dfn extends Element {
  constructor(params) {
    params.tagName = "dfn";
    super();
  }
}

export class Em extends Element {
  constructor(params) {
    params.tagName = "em";
    super();
  }
}

export class I extends Element {
  constructor(params) {
    params.tagName = "i";
    super();
  }
}

export class Kbd extends Element {
  constructor(params) {
    params.tagName = "kbd";
    super();
  }
}

export class Mark extends Element {
  constructor(params) {
    params.tagName = "mark";
    super();
  }
}

export class Q extends Element {
  constructor(params) {
    params.tagName = "q";
    super();
  }
}

export class Rp extends Element {
  constructor(params) {
    params.tagName = "rp";
    super();
  }
}

export class Rt extends Element {
  constructor(params) {
    params.tagName = "rt";
    super();
  }
}

export class Ruby extends Element {
  constructor(params) {
    params.tagName = "ruby";
    super();
  }
}

export class S extends Element {
  constructor(params) {
    params.tagName = "s";
    super();
  }
}

export class Samp extends Element {
  constructor(params) {
    params.tagName = "samp";
    super();
  }
}

export class Small extends Element {
  constructor(params) {
    params.tagName = "small";
    super();
  }
}

export class Span extends Element {
  constructor(params) {
    params.tagName = "span";
    super();
  }
}

export class Strong extends Element {
  constructor(params) {
    params.tagName = "strong";
    super();
  }
}

export class Sub extends Element {
  constructor(params) {
    params.tagName = "sub";
    super();
  }
}

export class Sup extends Element {
  constructor(params) {
    params.tagName = "sup";
    super();
  }
}

export class Time extends Element {
  constructor(params) {
    params.tagName = "time";
    super();
  }
}

export class U extends Element {
  constructor(params) {
    params.tagName = "u";
    super();
  }
}

export class Var extends Element {
  constructor(params) {
    params.tagName = "var";
    super();
  }
}

export class Wbr extends Element {
  constructor(params) {
    params.tagName = "wbr";
    super();
  }
}

export class Area extends Element {
  constructor(params) {
    params.tagName = "area";
    super();
  }
}

export class Audio extends Element {
  constructor(params) {
    params.tagName = "audio";
    super();
  }
}

export class Img extends Element {
  constructor(params) {
    params.tagName = "img";
    super();
  }
}

export class Map extends Element {
  constructor(params) {
    params.tagName = "map";
    super();
  }
}

export class Track extends Element {
  constructor(params) {
    params.tagName = "track";
    super();
  }
}

export class Video extends Element {
  constructor(params) {
    params.tagName = "video";
    super();
  }
}

export class Embed extends Element {
  constructor(params) {
    params.tagName = "embed";
    super();
  }
}

export class Iframe extends Element {
  constructor(params) {
    params.tagName = "iframe";
    super();
  }
}

export class Object extends Element {
  constructor(params) {
    params.tagName = "object";
    super();
  }
}

export class Param extends Element {
  constructor(params) {
    params.tagName = "param";
    super();
  }
}

export class Picture extends Element {
  constructor(params) {
    params.tagName = "picture";
    super();
  }
}

export class Source extends Element {
  constructor(params) {
    params.tagName = "source";
    super();
  }
}

export class Canvas extends Element {
  constructor(params) {
    params.tagName = "canvas";
    super();
  }
}

export class Noscript extends Element {
  constructor(params) {
    params.tagName = "noscript";
    super();
  }
}

export class Script extends Element {
  constructor(params) {
    params.tagName = "script";
    super();
  }
}

export class Del extends Element {
  constructor(params) {
    params.tagName = "del";
    super();
  }
}

export class Ins extends Element {
  constructor(params) {
    params.tagName = "ins";
    super();
  }
}

export class Caption extends Element {
  constructor(params) {
    params.tagName = "caption";
    super();
  }
}

export class Col extends Element {
  constructor(params) {
    params.tagName = "col";
    super();
  }
}

export class Colgroup extends Element {
  constructor(params) {
    params.tagName = "colgroup";
    super();
  }
}

export class Table extends Element {
  constructor(params) {
    params.tagName = "table";
    super();
  }
}

export class TBody extends Element {
  constructor(params) {
    params.tagName = "tbody";
    super();
  }
}

export class Td extends Element {
  constructor(params) {
    params.tagName = "td";
    super();
  }
}

export class Tfoot extends Element {
  constructor(params) {
    params.tagName = "tfoot";
    super();
  }
}

export class Th extends Element {
  constructor(params) {
    params.tagName = "th";
    super();
  }
}

export class THead extends Element {
  constructor(params) {
    params.tagName = "thead";
    super();
  }
}

export class Tr extends Element {
  constructor(params) {
    params.tagName = "tr";
    super();
  }
}

export class Button extends Element {
  constructor(params) {
    params.tagName = "button";
    super();
  }
}

export class Datalist extends Element {
  constructor(params) {
    params.tagName = "datalist";
    super();
  }
}

export class Fieldset extends Element {
  constructor(params) {
    params.tagName = "fieldset";
    super();
  }
}

export class Form extends Element {
  constructor(params) {
    params.tagName = "form";
    params.method = params.method || "POST";
    super();
  }
}

export class Input extends Element {
  constructor(params) {
    params.tagName = "input";
    super();
  }
}

export class Label extends Element {
  constructor(params) {
    params.tagName = "label";
    super();
  }
}

export class Legend extends Element {
  constructor(params) {
    params.tagName = "legend";
    super();
  }
}

export class Meter extends Element {
  constructor(params) {
    params.tagName = "meter";
    super();
  }
}

export class Optgroup extends Element {
  constructor(params) {
    params.tagName = "optgroup";
    super();
  }
}

export class Option extends Element {
  constructor(params) {
    params.tagName = "option";
    super();
  }
}

export class Output extends Element {
  constructor(params) {
    params.tagName = "output";
    super();
  }
}

export class Progress extends Element {
  constructor(params) {
    params.tagName = "progress";
    super();
  }
}

export class Select extends Element {
  constructor(params) {
    params.tagName = "select";
    super();
  }
}

export class Textarea extends Element {
  constructor(params) {
    params.tagName = "textarea";
    super();
  }
}

export class Details extends Element {
  constructor(params) {
    params.tagName = "details";
    super();
  }
}

export class Dialog extends Element {
  constructor(params) {
    params.tagName = "dialog";
    super();
  }
}

export class Summary extends Element {
  constructor(params) {
    params.tagName = "summary";
    super();
  }
}

export class Slot extends Element {
  constructor(params) {
    params.tagName = "slot";
    super();
  }
}

export class Template extends Element {
  constructor(params) {
    params.tagName = "template";
    super();
  }
}

export class Svg extends Element {
  constructor(params) {
    params.tagName = "svg";
    super();
  }
}

export class Math extends Element {
  constructor(params) {
    params.tagName = "math";
    super();
  }
}
