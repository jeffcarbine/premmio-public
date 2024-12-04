// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { smoothScroll } from "../../scripts/smoothScroll/smoothScroll.js";

/**
 * Toggle Accordions
 * This toggles the accordion open and closed.
 *
 * @param {HTMLElement} target - The accordion opening button.
 */
export const handleAccordionClick = (target) => {
  // the body of the accordion always follow right after the button
  const accordionBody = target.parentNode.nextElementSibling;

  toggleAccordion(accordionBody, target);
};

/**
 * Toggles the accordion open or closed.
 *
 * @param {HTMLElement} accordionBody - The body of the accordion.
 * @param {HTMLElement} accordionButton - The button that toggles the accordion.
 * @param {Function} [callback] - Optional callback function to execute after toggling.
 */
export const toggleAccordion = (accordionBody, accordionButton, callback) => {
  // check if the accordion is open
  const accordionOpen = accordionBody.classList.contains("open");

  // if not open
  if (!accordionOpen) {
    const height = accordionBody.offsetHeight,
      transitionDuration = getComputedStyle(accordionBody).getPropertyValue(
        "transition-duration"
      ),
      delay = parseFloat(transitionDuration.replace("s", "")) * 1000;

    // now set a 10ms timeout so we can add the height inline and then
    // transition to the height px value

    accordionBody.classList.add("open");
    accordionButton.classList.add("open");

    setTimeout(() => {
      accordionBody.style.height = height + "px";
    }, 10);

    // and after the transition duration, change the inline
    // height to "auto" so that we aren't stuck at a pixel height
    setTimeout(() => {
      accordionBody.style.height = "auto";
      accordionBody.style.overflow = "visible";
    }, delay);
  } else {
    closeAccordion(accordionBody, accordionButton);
  }
};

/**
 * Closes the accordion.
 *
 * @param {HTMLElement} accordionBody - The body of the accordion.
 * @param {HTMLElement} accordionButton - The button that toggles the accordion.
 */
export const closeAccordion = (accordionBody, accordionButton) => {
  const height = accordionBody.offsetHeight,
    transitionDuration = getComputedStyle(accordionBody).getPropertyValue(
      "transition-duration"
    ),
    delay = parseFloat(transitionDuration.replace("s", "")) * 1000;

  // set the accordion's height back to it's precise pixel amount
  accordionBody.style.height = height + "px";

  // and then set the overflow to hidden so that the
  // transition can occur
  accordionBody.style.overflow = "hidden";

  // then after a short timeout, set it to null so as
  // to trigger the transition
  setTimeout(() => {
    accordionBody.style.height = null;
  }, 10);

  // and then after the transition duration, remove the open
  // class from the accordion-body
  setTimeout(() => {
    accordionBody.classList.remove("open");
    accordionButton.classList.remove("open");
  }, delay);
};

// // event for opening the accordion via the .toggle element
addEventDelegate("click", ".accordion .accordion-button", handleAccordionClick);

// automatically expand the accordion that matches the hash
const params = new URLSearchParams(window.location.search),
  openAccordionHash = params.get("openaccordion");

if (openAccordionHash !== null) {
  const openAccordion = document.querySelector(
    ".accordion#" + openAccordionHash
  );

  // delay to illustate the location of the faq
  setTimeout(() => {
    smoothScroll({ query: "#" + openAccordionHash });

    // and then open the accordion
    setTimeout(() => {
      const accordionButton = openAccordion.querySelector("button");
      handleAccordionClick(accordionButton);

      // and give the accordion a highlighted class
      openAccordion.classList.add("highlighted");
    }, 500);
  }, 500);
}

/**
 * Opens an accordion after it has been scrolled to.
 *
 * @param {HTMLElement} element - The element that triggers the accordion open.
 */
export const openAccordionOnHash = (element) => {
  const accordionId = element.dataset.accordionid,
    accordion = document.querySelector(".accordion#" + accordionId),
    accordionBody = accordion.querySelector(".accordion-body"),
    accordionButton = accordion.querySelector(".accordion-button");

  // scroll to the accordion
  smoothScroll({ query: "#" + accordionId });

  // open the accordion after a short delay
  setTimeout(() => {
    toggleAccordion(accordionBody, accordionButton);
  }, 500);
};

addEventDelegate("click", "[data-accordionid]", openAccordionOnHash);
