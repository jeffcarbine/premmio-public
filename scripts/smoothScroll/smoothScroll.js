// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Smooth Scroll Click
 * Handles intercepting link clicks with hash hrefs
 *
 * @param {HTMLElement} link - The link that contains the hash href.
 */
const smoothScrollClick = (link) => {
  // get the href attribute of the link
  let hash = link.getAttribute("href");

  // and scroll to it
  smoothScroll({ query: hash });
};

/**
 * Smooth Scroll
 * Handles scrolling to the correct position
 *
 * @param {Object} options - The options for smooth scrolling.
 * @param {string} options.query - The query selector for the target element.
 * @param {number} [options.offset=0] - The offset for scrolling.
 * @param {string} [options.offsetElement] - The query selector for the offset element.
 */
export const smoothScroll = ({ query, offset, offsetElement }) => {
  const target = document.querySelector(query);

  let offsetAmount = 0;

  if (offsetElement) {
    const offsetTarget = document.querySelector(offsetElement);
    offsetAmount = offsetTarget.getBoundingClientRect().top;
  }

  if (offset) {
    offsetAmount = offset;
  }

  const elementPosition = target.getBoundingClientRect().top,
    offsetPosition = elementPosition + window.scrollY - offsetAmount;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

/**
 * Get Scroll Parent
 * This gets the parent of the element we are trying to scroll to in the
 * event that the element is inside of its own scrollable container and
 * not just in the main body
 *
 * @param {HTMLElement} target - The element on screen that we are trying to scroll to.
 * @returns {HTMLElement|Window} The scroll parent element or the window.
 */
const getScrollParent = (target) => {
  let parent = target.parentNode;

  // if the parent is the document, then
  // parent is actually the window
  if (parent === document) {
    return window;
  } else if (
    // check that the parent doesn't have an overflowY scroll value
    parent !== document &&
    window.getComputedStyle(parent).overflowY !== "scroll"
  ) {
    // if so, run this again on the parent
    return getScrollParent(parent);
  } else {
    // we've found the parent
    return parent;
  }
};

// and set the event delegate
addEventDelegate("click", "a[href^='#']", smoothScrollClick, true);

// smooth-scroll with query selector instead of hash
const params = new URLSearchParams(window.location.search),
  query = decodeURIComponent(params.get("scrollto"));

if (query !== "null") {
  window.onload = () => {
    smoothScroll({ query });
  };
}
