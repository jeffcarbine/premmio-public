/**
 * Viewport Class
 * Allows you to add classes to an element when they
 * enter the viewport
 */

/**
 * Callback function for the IntersectionObserver.
 *
 * @param {IntersectionObserverEntry[]} entries - The entries being observed.
 * @param {IntersectionObserver} vclassObserver - The observer instance.
 */
const observerCallback = (entries, vclassObserver) => {
  // reivew all the corresponding vclass entries
  entries.forEach((entry) => {
    // if we find it to be intersecting the viewport
    if (entry.isIntersecting) {
      // get the element
      let element = entry.target;
      // get it's vclass data property, plus a space
      let vclass = " " + element.dataset.vclass;
      // add that to the end of the element's className
      element.className += vclass;
      // and then stop observing this entry
      vclassObserver.unobserve(element);
    }
  });
};

/**
 * Observes elements with the data-vclass attribute and adds the specified class when they enter the viewport.
 */
export const observeViewportClassElements = () => {
  // on page load, get all the elements that have a data-vclass property
  const vclassElements = document.querySelectorAll(
    "[data-vclass]:not([data-vclass-observed=true]"
  );

  // and then observe each one
  vclassElements.forEach((element) => {
    // check just in case there are no matching elements
    if (element) {
      // observe it!

      // create the intersection observer for vclass
      var vclassObserver = new IntersectionObserver(observerCallback, {
        rootMargin: element.dataset.vclassMargin || "0px",
        threshold: 0.1,
      });

      vclassObserver.observe(element);
      element.dataset.vclassObserved = true;
    }
  });
};

observeViewportClassElements();
