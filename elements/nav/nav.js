import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const toggleSubmenu = (button) => {
  // TODO: use transitionend event
  // instead of the transitionDuration
  // stuff

  const submenu = button.nextElementSibling,
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
      submenu.style.height = "auto";
    }, delay);
    // otherwise
  } else {
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
  }
};

export const enableToggleSubmenu = () => {
  addEventDelegate("click", "nav ul li button", toggleSubmenu);
};

const setNavBackground = (scrollPos) => {
  const nav = document.querySelector("nav");

  const _100vh = window.innerHeight;

  if (scrollPos > _100vh) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
};

export const enableSetNavBackground = () => {
  addEventDelegate("scroll", window, setNavBackground);
};

export const enableNav = () => {
  enableToggleNav();
  enableToggleSubmenu();
};
