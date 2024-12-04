// Modules
import { addEventDelegate } from "../modules/eventDelegate/eventDelegate.js";

const components = document.querySelectorAll("[data-component]"),
  loadedComponents = [];

/**
 * Loads the script for a given component if it hasn't been loaded already.
 *
 * @param {string} name - The name of the component.
 * @param {string} [parent="premmio/public"] - The parent directory of the component.
 */
const loadComponentScript = (name, parent = "premmio/public") => {
  if (!loadedComponents.includes(name)) {
    loadedComponents.push(name);

    let parentPath = `/${parent}/`;

    if (parent === "/") {
      parentPath = "/";
    }

    // if the name has a slash in it, it is a sub-component
    // and we need to load it from a sub-directory
    if (name.includes("/")) {
      import(`${parentPath}components/${name}.scripts.js`);
    } else {
      import(`${parentPath}components/${name}/${name}.scripts.js`);
    }
  }
};

components.forEach((component) => {
  const name = component.dataset.component,
    parent = component.dataset.parent;

  if (parent !== undefined) {
    loadComponentScript(name, parent);
  } else {
    loadComponentScript(name);
  }
});

/**
 * Handles the mutation of a component by loading its script.
 *
 * @param {HTMLElement} element - The element that was mutated.
 */
const handleMutationComponent = (element) => {
  /**
   * Loads the script for a given element's component.
   *
   * @param {HTMLElement} el - The element to load the component script for.
   */
  const loadComponent = (el) => {
    const name = el.dataset.component,
      parent = el.dataset.parent;

    if (parent !== undefined) {
      loadComponentScript(name, parent);
    } else {
      loadComponentScript(name);
    }
  };

  /**
   * Traverses the element and its children to load component scripts.
   *
   * @param {HTMLElement} el - The element to traverse.
   */
  const traverseAndLoad = (el) => {
    if (el.dataset.component) {
      loadComponent(el);
    }
    Array.from(el.children).forEach(traverseAndLoad);
  };

  traverseAndLoad(element);
};

addEventDelegate("childList", "[data-component]", handleMutationComponent);
