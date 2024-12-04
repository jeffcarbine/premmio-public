// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Check responsive images
 */
const checkResponsiveImage = (image) => {
  const imageBreakpoints = [100, 400, 900, 1500],
    breakpointNames = ["xs", "sm", "md", "lg"];

  // check the actual width of the image on the screen
  const imageWidth = image.offsetWidth;

  // check to see if the imageWidth is different than the data-width attribute
  // and only run the rest of the function if it is
  if (imageWidth !== parseInt(image.getAttribute("data-width"))) {
    image.setAttribute("data-width", imageWidth);

    // if the image is greater than the largest breakpoint, set the src to the largest breakpoint or the default src
    if (imageWidth > imageBreakpoints[imageBreakpoints.length - 1]) {
      let newSrc = null;
      let activeBreakpoint = null;

      for (let i = breakpointNames.length - 1; i >= 0; i--) {
        newSrc = image.getAttribute(`data-src_${breakpointNames[i]}`);
        if (newSrc) {
          activeBreakpoint = breakpointNames[i];
          break;
        }
      }

      newSrc = newSrc || image.getAttribute("data-src");
      activeBreakpoint = activeBreakpoint || "default";

      const img = new Image();
      img.onload = function () {
        image.src = this.src;
        image.setAttribute("data-active-src", activeBreakpoint);
      };
      img.src = newSrc;
    } else {
      // loop through the breakpoints
      for (let i = 0; i < imageBreakpoints.length; i++) {
        // if the image is smaller than the breakpoint, change the src
        if (imageWidth < imageBreakpoints[i]) {
          if (image.getAttribute("data-active-src") !== breakpointNames[i]) {
            // check to see if we have a src for the current breakpoint
            let newSrc = image.getAttribute(`data-src_${breakpointNames[i]}`);

            // if not, default to the data-src attribute
            newSrc = newSrc || image.getAttribute("data-src");

            const img = new Image();
            img.onload = function () {
              image.src = this.src;
              image.setAttribute("data-active-src", breakpointNames[i]);
            };
            img.src = newSrc;
          }

          break;
        }
      }
    }

    // set the data-responsive-checked attribute to true
    image.setAttribute("data-responsive-checked", "true");

    // after this is done, check to see if the image has a data-image-group attribute
    const imageGroup = image.getAttribute("data-image-group");

    if (imageGroup) {
      // look for other images with the same data-image-group attribute
      const imageGroupImages = document.querySelectorAll(
        `[data-image-group="${imageGroup}"]`
      );

      // loop through the images
      imageGroupImages.forEach((groupImage) => {
        // check to see if the other images have data-responsive-checked attribute set to true
        // if they all come back as true, find any elements that have a data-image-group-listener attribute
        // and set the data-group-loaded attribute to true
        const allImagesChecked = Array.from(imageGroupImages).every(
          (image) => image.getAttribute("data-responsive-checked") === "true"
        );

        if (allImagesChecked) {
          const groupListeners = document.querySelectorAll(
            `[data-image-group-listener="${imageGroup}"]`
          );

          groupListeners.forEach((listener) => {
            listener.setAttribute("data-group-loaded", "true");
          });
        }
      });
    }
  }
};

/**
 * Checks and updates responsive images based on their width.
 */
const checkResponsiveImages = () => {
  const responsiveImages = document.querySelectorAll(
    `[data-component="responsiveImg"]`
  );

  // loop through the responsiveImages
  responsiveImages.forEach((image) => {
    checkResponsiveImage(image);
  });
};

/**
 * Checks images on load, resize, scroll, and mutation.
 */
const checkImages = () => {
  checkResponsiveImages();

  // check again once the viewport is loaded
  addEventDelegate("load", window, checkResponsiveImages);

  // check viewport on resize
  addEventDelegate("resize", window, checkResponsiveImages);
};

addEventDelegate("load", window, checkImages);

// check viewport on childList mutation and open attribute change
addEventDelegate(
  "childList, attributes:open",
  "img[data-component='responsiveImg']",
  checkResponsiveImages
);

// check images on scroll
addEventDelegate("scroll", window, checkResponsiveImages);

const checkResponsiveImageAfterDelay = (image) => {
  setTimeout(() => {
    checkResponsiveImage(image);
  }, 1000);
};

// check individual images on size change
addEventDelegate(
  "click",
  "img[data-component='responsiveImg']",
  checkResponsiveImageAfterDelay
);
