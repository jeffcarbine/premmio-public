/**
 * Load Class
 *
 * This will add a class to an element when it is loaded
 */

// get any loadclass elements
const loadClassElements = document.querySelectorAll("[data-loadclass]");

/**
 * Adds a class to an element when it is loaded.
 *
 * @param {HTMLElement} element - The element to add the class to.
 */
const loadClass = (element) => {
  const className = element.dataset.loadclass;

  element.classList.add(className);

  // find any loadclass listeners
  const listenerId = element.id,
    loadClassListeners = document.querySelectorAll(
      "[data-loadclass-listenerid=" + listenerId + "]"
    );

  loadClassListeners.forEach((listener) => {
    listener.classList.add(className);
  });
};

loadClassElements.forEach((element) => {
  if (element.complete) {
    loadClass(element);
  } else {
    element.onload = () => {
      loadClass(element);
    };
  }
});
