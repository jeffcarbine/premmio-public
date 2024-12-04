// Elements
import { Ul, Li, Button } from "../../template/elements.html.js";

/**
 * Generates a slider component.
 *
 * @param {Object} options - The options for the slider component.
 * @param {Array<Object>} options.elements - The array of elements to include in the slider.
 * @param {Array<Object>} [options.preSlides] - The array of pre-slide elements.
 * @param {string} [options.className=""] - The class name for the slider.
 * @param {boolean} [options.clickSlides=false] - Whether the slides are clickable.
 * @param {string} [options.id] - The ID of the slider.
 * @param {boolean} [options.showControls] - Whether to show the slider controls
 * @param {boolean} [options.autoAdvance] - Whether to auto-advance the slides
 * @param {number} [options.duration] - The time to wait before auto-advancing the slides
 * @param {boolean} [options.pauseOnHover=true] - Whether to pause the auto-advance on hover
 * @returns {Object} The slider component configuration.
 */
export const Slider = ({
  elements,
  preSlides,
  className = "",
  clickSlides = false,
  id,
  showControls = true,
  autoAdvance = false,
  pauseOnHover = true,
  duration = 5000,
} = {}) => {
  const slides = [],
    children = [];

  if (preSlides !== undefined) {
    children.push(preSlides);
  }

  let farCount = 1;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    // all sliders default state is zero, so
    // we calculate the slide's state based on that
    let state = "inactive";

    if (i === 0) {
      state = "active";
    } else if (elements.length === 2) {
      state = "next1";
    } else if (i > 0 && i < elements.length / 2) {
      state = "next" + farCount;
      farCount++;
    } else if (i >= elements.length / 2 && i < elements.length) {
      farCount--;
      state = "prev" + farCount;
    }

    const slide = new Li({
      class: "slide",
      "data-index": i,
      "data-state": state,
      child: element,
    });

    slides.push(slide);
  }

  children.push(
    new Ul({
      class: "slides",
      "data-count": slides.length - 1, // to account for zero-index
      "data-active": 0,
      children: slides,
    })
  );

  if (elements.length > 1 && showControls) {
    children.push({
      class: "slider-controls",
      children: [
        new Button({
          class: "slider-control prev",
          "aria-label": "next1",
          "data-direction": "next1",
        }),
        new Button({
          class: "slider-control next",
          "aria-label": "prev1",
          "data-direction": "prev1",
        }),
      ],
    });
  }

  const sliderData = {
    class: `slider ${className}`,
    "data-click-slides": clickSlides,
    "data-component": "slider",
    "data-auto-advance": autoAdvance,
    "data-pause-on-hover": pauseOnHover,
    "data-duration": duration,
    children,
  };

  if (id) {
    sliderData.id = id;
  }

  return sliderData;
};
