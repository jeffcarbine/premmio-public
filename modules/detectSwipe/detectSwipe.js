// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Detects swipe gestures on a target element and triggers corresponding callbacks.
 *
 * @param {Object} options - The options for detecting swipe gestures.
 * @param {HTMLElement} options.target - The target element to detect swipe gestures on.
 * @param {function} [options.left] - The callback function to trigger on a left swipe.
 * @param {function} [options.right] - The callback function to trigger on a right swipe.
 * @param {function} [options.up] - The callback function to trigger on an up swipe.
 * @param {function} [options.down] - The callback function to trigger on a down swipe.
 */

export const detectSwipe = ({ target, left, right, up, down } = {}) => {
  let startX = 0,
    startY = 0;

  /**
   * Handles the touchstart event and records the starting touch coordinates.
   *
   * @param {HTMLElement} target - The target element.
   * @param {TouchEvent} e - The touch event.
   */
  const handleTouchStart = (target, e) => {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  };

  /**
   * Handles the touchmove event and disables body scrolling if a horizontal swipe is detected.
   *
   * @param {HTMLElement} target - The target element.
   * @param {TouchEvent} e - The touch event.
   */
  const handleTouchMove = (target, e) => {
    const moveX = e.changedTouches[0].screenX - startX;

    if (moveX > 10 || moveX < -10) {
      // make body overflow hidden
      const body = document.querySelector("body");

      body.style.overflow = "hidden";
    }
  };

  /**
   * Handles the touchend event, calculates the swipe direction, and triggers the corresponding callback.
   *
   * @param {HTMLElement} target - The target element.
   * @param {TouchEvent} e - The touch event.
   */
  const handleTouchEnd = (target, e) => {
    // make body overflow inherit
    const body = document.querySelector("body");

    body.style.overflow = "inherit";

    const diffX = e.changedTouches[0].screenX - startX;
    const diffY = e.changedTouches[0].screenY - startY;
    const ratioX = Math.abs(diffX / diffY);
    const ratioY = Math.abs(diffY / diffX);
    const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY);

    // Ignore small movements.
    if (absDiff < 30) {
      return;
    }

    if (ratioX > ratioY) {
      if (diffX >= 0) {
        if (left !== undefined) {
          left(target);
        }
      } else {
        if (right !== undefined) {
          right(target);
        }
      }
    } else {
      if (diffY >= 0) {
        if (down !== undefined) {
          down(target);
        }
      } else {
        if (up !== undefined) {
          up(target);
        }
      }
    }
  };

  addEventDelegate("touchstart", target, handleTouchStart);
  addEventDelegate("touchmove", target, handleTouchMove);
  addEventDelegate("touchend", target, handleTouchEnd);
};
