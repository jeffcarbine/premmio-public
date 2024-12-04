// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Closes the submenu with a transition effect.
 *
 * @param {HTMLElement} submenu - The submenu element to close.
 * @param {HTMLElement} button - The button element that toggles the submenu.
 * @param {HTMLElement} listItem - The list item element containing the submenu.
 */
const closeSubmenu = (submenu, button, listItem) => {
  // start by measuring the submenu
  const height = submenu.offsetHeight,
    // get the transition duration from CSS
    transitionDuration = getComputedStyle(submenu).getPropertyValue(
      "transition-duration"
    ),
    // and parse it into milliseconds
    delay = parseFloat(transitionDuration.replace("s", "")) * 1000;

  // set the submenu's height property back
  // to the actual current pixel height
  submenu.style.height = height + "px";

  // then after a short timeout, set it to null so as
  // to trigger the transition
  setTimeout(() => {
    submenu.style.height = null;
  }, 10);

  // and then after the transition duration, remove the
  // open class from the submenu
  setTimeout(() => {
    submenu.classList.remove("open");
    button.classList.remove("open");
    listItem.classList.remove("open");
  }, delay);
};

/**
 * Toggles the submenu open or closed.
 *
 * @param {HTMLElement} button - The button element that toggles the submenu.
 */
const toggleSubmenu = (button) => {
  const submenu = button.parentNode.querySelector(".submenu"),
    listItem = button.parentNode,
    isOpen = submenu.classList.contains("open");

  // start by measuring the submenu
  const height = submenu.offsetHeight,
    // get the transition duration from CSS
    transitionDuration = getComputedStyle(submenu).getPropertyValue(
      "transition-duration"
    ),
    // and parse it into milliseconds
    delay = parseFloat(transitionDuration.replace("s", "")) * 1000;

  // if the submenu isn't open
  if (!isOpen) {
    // find the currenly open submenu, if any, and close it
    const openSubmenu = document.querySelector("nav ul li.open"),
      activeSubmenu = document.querySelector("nav ul li.active");

    if (openSubmenu) {
      const openSubmenuSubmenu = openSubmenu.querySelector(".submenu"),
        openSubmenuButton = openSubmenu.querySelector("button");

      closeSubmenu(openSubmenuSubmenu, openSubmenuButton, openSubmenu);
    }

    // set the submenu to the exact pixel height
    // after a minor delay
    setTimeout(() => {
      submenu.style.height = height + "px";
    }, 10);

    // add class of open
    submenu.classList.add("open");
    button.classList.add("open");
    listItem.classList.add("open");

    // and after the transition duration, change the inline
    // height to "auto" so that we aren't stuck at a pixel height
    setTimeout(() => {
      //submenu.style.height = "auto";
    }, delay);
    // otherwise
  } else {
    closeSubmenu(submenu, button, listItem);
  }
};

addEventDelegate("click", "nav ul li button", toggleSubmenu);

/**
 * Closes all open submenus when clicking outside of the navigation.
 *
 * @param {HTMLElement} element - The element that was clicked.
 */
const closeSubmenus = (element) => {
  if (element.closest("nav")) {
    return;
  }

  const openSubmenus = document.querySelectorAll("nav ul li.open");

  openSubmenus.forEach((listItem) => {
    const submenu = listItem.querySelector(".submenu"),
      button = listItem.querySelector("button");

    closeSubmenu(submenu, button, listItem);
  });
};

addEventDelegate("click", ":not(nav), :not(nav *)", closeSubmenus);
