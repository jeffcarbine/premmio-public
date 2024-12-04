// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Sets the alignment of the more buttons container based on the button's position.
 */
const setMoreBtnsAlignment = (btn) => {
  // get the parent moreBtn
  const moreBtn = btn.closest(".moreBtns");

  // Find the nearest parent container with overflow scroll
  let container = moreBtn.parentElement;
  while (
    container &&
    container !== document.body &&
    getComputedStyle(container).overflow !== "scroll"
  ) {
    container = container.parentElement;
  }
  if (!container) {
    container = document.body;
  }

  const btnRect = moreBtn.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Set horizontal alignment
  if (btnRect.left < containerRect.left) {
    moreBtn.dataset.xalignment = "left";
  } else {
    moreBtn.dataset.xalignment = "right";
  }

  // Set vertical alignment
  if (btnRect.bottom < containerRect.bottom - 200) {
    moreBtn.dataset.yalignment = "bottom";
  } else {
    moreBtn.dataset.yalignment = "top";
  }
};

/**
 * Toggles the active class on the more buttons container and the button itself.
 *
 * @param {HTMLElement} btn - The button element that triggers the toggle.
 */
const toggleMoreBtns = (btn) => {
  // check to see if the parent has a data-alignment that isnt't empty
  if (!btn.closest(".moreBtns").dataset.alignment) {
    setMoreBtnsAlignment(btn);
  }

  const moreBtns = btn.parentNode;

  setTimeout(() => {
    moreBtns.classList.toggle("active");
    btn.classList.toggle("active");
  }, 5);
};

/**
 * Closes all active more buttons containers.
 */
const closeMoreBtns = () => {
  const moreBtnsActive = document.querySelectorAll(".moreBtns.active");

  if (moreBtnsActive) {
    moreBtnsActive.forEach((moreBtns) => {
      moreBtns.classList.remove("active");
      moreBtns.querySelector(".btn.active").classList.remove("active");
    });
  }
};

addEventDelegate("click", ".moreBtns > .btn", toggleMoreBtns);
addEventDelegate("click", ":not(.moreBtns), :not(.moreBtns *)", closeMoreBtns);
