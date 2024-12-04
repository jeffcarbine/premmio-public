/**
 * Calculates the number of pixels an element has scrolled past its original top position.
 *
 * @param {HTMLElement} element - The element to calculate the scroll position for.
 */
export const pxPastTheTop = (element) => {
  /**
   * Calculates the original top position of an element.
   *
   * @param {HTMLElement} el - The element to calculate the top position for.
   * @returns {number} The original top position of the element.
   */
  const getOriginalTop = (el) => {
    let top = 0;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    return top;
  };

  // Store the original top position as a data attribute
  element.setAttribute("data-top", getOriginalTop(element));

  /**
   * Handles the scroll event and calculates the offset.
   */
  const handleScroll = () => {
    const originalTop = parseInt(element.getAttribute("data-top"), 10);
    let offset = 0;

    // Check for data-element-offset attribute and calculate the offset
    const elementOffsetSelector = element.getAttribute("data-element-offset");
    if (elementOffsetSelector) {
      const offsetElement = document.querySelector(elementOffsetSelector);
      if (offsetElement) {
        offset += offsetElement.offsetHeight;
      }
    }

    // Check for data-px-offset attribute and add the pixel offset
    const pxOffset = parseInt(element.getAttribute("data-px-offset"), 10);
    if (!isNaN(pxOffset)) {
      offset += pxOffset;
    }

    // Determine the parent element for the maximum amount calculation
    const parentSelector = element.getAttribute("data-parent") || "body";
    const parentElement = document.querySelector(parentSelector);
    const parentRect = parentElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const pixelsPastTop = Math.max(0, window.scrollY - originalTop + offset);

    // Calculate the "hit box" of the element
    const hitBoxSize = elementRect.height + offset;
    const parentBottom = parentRect.bottom + window.scrollY;

    // Update the --pxPastTheTop value based on the current scroll position
    if (window.scrollY + hitBoxSize >= parentBottom) {
      element.style.setProperty(
        "--pxPastTheTop",
        `${parentBottom - elementRect.height - originalTop}px`
      );
    } else {
      element.style.setProperty("--pxPastTheTop", `${pixelsPastTop}px`);
    }
  };

  window.addEventListener("scroll", handleScroll);

  // Initial calculation
  handleScroll();
};
