// Elements
import {
  Element,
  Ul,
  Li,
  A,
  Button,
  Span,
} from "../../template/elements.html.js";

/**
 * Class representing the navigation component.
 *
 * @extends Element
 */
export class Navigation extends Element {
  /**
   * Creates an instance of Navigation.
   *
   * @param {Object} params - The parameters for the navigation component.
   */
  constructor(params) {
    super(params);

    this.id = "navigation";
    this["data-component"] = "navigation";
    const nav = {
      tagName: "nav",
      children: [],
    };
    this.children = [nav, { class: "overlay" }];

    if (params.children) {
      this.children = this.children.concat(params.children);
    }

    /**
     * Creates navigation items based on the provided routes.
     *
     * @param {Object} routes - The routes for the navigation items.
     * @returns {Array<Li>} The array of navigation items.
     */
    const createNavItems = (routes) => {
      const navItems = [];

      const embellishments = params.embellishments || false;

      for (let route in routes) {
        let navItem;

        const path = routes[route] || "",
          basePath = params.basePath || "/";

        if (typeof path === "string") {
          const active = path === params.path,
            external = path.includes("http");

          navItem = new Li({
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (active ? " active" : ""),
            children: [
              new Span({ if: embellishments, class: "embellishment-1" }),
              new A({
                tabindex: 0,
                href: path,
                textContent: route,
                target: external ? "_blank" : "",
              }),
              new Span({ if: embellishments, class: "embellishment-2" }),
            ],
          });
          // then we have textcontent
        } else if (Array.isArray(path)) {
          // the href is always the first array element
          const href = path[0],
            children = path.slice(1);

          const active = href === params.path;

          const isExternal = href.includes("http");

          const link = new A({
            tabindex: 0,
            href,
            children,
          });

          // if it has an external href OR the fourth element is true
          if (isExternal || path[3]) {
            link.target = "_blank";
          }

          navItem = new Li({
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (active ? " active" : ""),
            children: [
              new Span({ class: "embellishment-1" }),
              link,
              new Span({ class: "embellishment-2" }),
            ],
          });
        } else {
          // create a copy of the path object
          const submenuPaths = Object.assign({}, path);

          // check to see if the value of a key is an array, if so replace the value with the
          // first element of the array
          for (let key in submenuPaths) {
            if (Array.isArray(path[key])) {
              submenuPaths[key] = path[key][0];
            }
          }

          // check to see if any of the values in the object is contained or equal to the current path
          const childActive = Object.values(submenuPaths).some(
            (path) =>
              path === params.path ||
              (path !== basePath &&
                params.path !== undefined &&
                params.path.includes(path))
          );

          let buttonContent;

          // if there is a property called "_html" in the object, then we need to render
          // that as the content of the button istead of the route
          if (path._html) {
            buttonContent = path._html;
          } else {
            buttonContent = route;
          }

          delete path._html;

          navItem = new Li({
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (childActive ? " active child-active" : ""),
            children: [
              new Span({ class: "embellishment-1" }),
              new Button(buttonContent),
              new Span({ class: "embellishment-2" }),
              {
                class: "submenu",
                child: new Ul(createNavItems(path)),
              },
            ],
          });
        }

        navItems.push(navItem);
      }

      return navItems;
    };

    const ul = new Ul(createNavItems(params.routes));
    nav.children.unshift(ul);
  }
}
