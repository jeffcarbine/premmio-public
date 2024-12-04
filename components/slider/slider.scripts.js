// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { detectSwipe } from "../../modules/detectSwipe/detectSwipe.js";

/**
 * Changes the slider based on the button direction.
 *
 * @param {HTMLElement} button - The button element that triggers the slider change.
 */
const changeSlider = (button) => {
  const direction = button.dataset.direction,
    slider = button.parentNode.previousElementSibling;

  if (direction === "next1") {
    changeActive(slider, true);
  } else {
    changeActive(slider, false);
  }
};

/**
 * Changes the active slide in the slider.
 *
 * @param {HTMLElement} slider - The slider element.
 * @param {boolean} forwards - The direction to change the slide.
 */
const changeActive = (slider, forwards) => {
  let activeSlide = parseInt(slider.dataset.active),
    slideCount = parseInt(slider.dataset.count);

  if (!forwards) {
    // increase the slide value
    if (activeSlide == slideCount) {
      activeSlide = 0;
    } else {
      activeSlide++;
    }
  } else {
    // decrease the slide value
    if (activeSlide == 0) {
      activeSlide = slideCount;
    } else {
      activeSlide--;
    }
  }

  slider.dataset.active = activeSlide;
};

/**
 * Slides the slider forwards.
 *
 * @param {HTMLElement} slider - The slider element.
 */
const slideForwards = (slider) => {
  const slides = slider.querySelector(".slides");
  changeActive(slides, true);
};

/**
 * Slides the slider backwards.
 *
 * @param {HTMLElement} slider - The slider element.
 */
const slideBackwards = (slider) => {
  const slides = slider.querySelector(".slides");
  changeActive(slides, false);
};

addEventDelegate("click", "button.slider-control", changeSlider);

detectSwipe({
  target: ".slider",
  left: slideForwards,
  right: slideBackwards,
});

/**
 * Changes the state of the slider based on the slide that was clicked.
 *
 * @param {HTMLElement} slide - The slide element that was clicked.
 */
const clickSlide = (slide) => {
  // get the index from the slide
  const index = parseInt(slide.dataset.index),
    slider = slide.closest(".slider"),
    slides = slider.querySelector(".slides");

  // set the active slide to the index
  slides.dataset.active = index;
};

addEventDelegate(
  "click",
  ".slider[data-click-slides='true'] .slides .slide",
  clickSlide
);

/**
 * Updates the state of each slide based on the active slide.
 *
 * @param {HTMLElement} slidesList - The list of slides.
 */
const slide = (slidesList) => {
  const activeSlide = parseInt(slidesList.dataset.active), // 7
    slideCount = parseInt(slidesList.dataset.count), // 14
    // count of half the slideCount, rounded down
    halfCount = Math.floor(slideCount / 2), // 7
    slides = slidesList.childNodes;

  slides.forEach((slide) => {
    // we need to determine the slide's state based on the activeSlide value in relation to the slideCount and the slide's index
    const index = parseInt(slide.dataset.index); // 0 prev7

    // if the slide is the active slide
    if (index === activeSlide) {
      slide.dataset.state = "active";
    } else {
      // if the slide is before the active slide, or it is greater than the halfway point
      if (
        (index < activeSlide && index >= activeSlide - halfCount) ||
        index > activeSlide + halfCount
      ) {
        // then it is a previous slide, and we now need to determine how far back it is
        const distance =
          activeSlide - index >= 0
            ? activeSlide - index
            : slideCount - index + activeSlide + 1;
        slide.dataset.state = `prev${distance}`;
      } else {
        // if the slide is after the active slide, or it is less than the halfway point
        // then it is a next slide, and we now need to determine how far ahead it is
        const distance =
          index - activeSlide >= 0
            ? index - activeSlide
            : slideCount - activeSlide + index + 1;
        slide.dataset.state = `next${distance}`;
      }
    }
  });
};

addEventDelegate("attributes:data-active", ".slider .slides", slide);

/**
 * Auto-advances the slider on a timeout if data-auto-advance is true, and resets the timeout when the slider is hovered.
 */
const autoAdvance = (sliders) => {
  sliders.forEach((slider) => {
    const duration = parseInt(slider.dataset.duration) || 5000,
      pauseOnHover = slider.dataset.pauseOnHover !== "false";

    let timeout;

    const advance = () => {
        slideBackwards(slider);
      },
      advanceTimeout = () => {
        timeout = setInterval(advance, duration);
      };

    advanceTimeout();

    if (pauseOnHover) {
      const handleMouseEnter = () => {
        clearInterval(timeout);
        slider.removeEventListener("mouseenter", handleMouseEnter);
      };

      const handleMouseLeave = () => {
        advanceTimeout();
        slider.addEventListener("mouseenter", handleMouseEnter);
      };

      slider.addEventListener("mouseenter", handleMouseEnter);
      slider.addEventListener("mouseleave", handleMouseLeave);
    }
  });
};

const autoAdvanceSliders = document.querySelectorAll(
  ".slider[data-auto-advance='true']"
);

if (autoAdvanceSliders.length > 0) {
  autoAdvance(autoAdvanceSliders);
}
