/**
 * Generates icons and renders them in their respective locations in the browser.
 *
 * @param {Object} iconList - The list of icons to generate.
 */
export const generateIcons = (iconList) => {
  // take the imported icons and render them in their respective locations in the browser
  for (let iconName in iconList) {
    const iconString = iconList[iconName];

    // now find all the icons onscreen that need to be loaded
    const unloadedIcons = document.querySelectorAll("[data-icon=" + iconName);

    // and loop throuhg them to generate the icon
    unloadedIcons.forEach((unloadedIcon) => {
      // remove the data-icon attribute so we don't double load icons
      unloadedIcon.removeAttribute("data-icon");

      const icon = loadIcon(iconString, iconName);

      // and make it a child if element is not an i,
      // otherwise, replace the element
      // check to see if the element is an <i>, in which
      // case we replace it with our svg
      if (unloadedIcon.tagName === "I") {
        // get the parent
        let parent = unloadedIcon.parentNode;
        // append the icon before the target
        parent.appendChild(icon, unloadedIcon);
        // remove the target
        target.remove();
      } else {
        // append the icon to the target
        unloadedIcon.appendChild(icon);
      }
    });
  }
};

/**
 * Loads an icon and converts it into an element object.
 *
 * @param {string} iconString - The SVG string of the icon.
 * @param {string} iconName - The name of the icon.
 * @returns {Element} The icon element.
 */
const loadIcon = (iconString, iconName) => {
  // this prevents icon's styles from bleeding over into other
  // icons - this is because of how Adobe exports SVGs
  const iconMarkup =
    "<svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 320.27 316.32'>" +
    iconString.replace(/cls/g, iconName) +
    "</svg>";

  // now convert that markup into an element object
  let icon = new DOMParser().parseFromString(iconMarkup, "text/xml").firstChild;

  // set the appropriate class for the svg
  icon.setAttribute("class", "icon-" + iconName);

  return icon;
};
