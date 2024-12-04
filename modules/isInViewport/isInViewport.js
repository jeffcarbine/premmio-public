/**
 * Observes elements to determine if they are in the viewport and triggers callbacks.
 *
 * @param {string} query - The query selector for the elements to observe.
 * @param {function} enterCallback - The callback function to trigger when an element enters the viewport.
 * @param {function} [exitCallback] - The callback function to trigger when an element exits the viewport.
 */
export const isInViewport = (query, enterCallback, exitCallback) => {
  /**
   * Callback function for the IntersectionObserver.
   *
   * @param {IntersectionObserverEntry[]} entries - The entries being observed.
   */
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        enterCallback(entry.target);
      } else if (exitCallback) {
        exitCallback(entry.target);
      }
    });
  };

  // Create the intersection observer
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0,
  });

  // Get the elements that match the query
  const elements = document.querySelectorAll(query);

  // Observe each element
  elements.forEach((element) => {
    observer.observe(element);
  });
};
