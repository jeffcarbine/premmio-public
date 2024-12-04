/**
 * Sets the form data based on the provided data object.
 *
 * @param {Object} data - The data object containing key-value pairs to set in the form.
 * @param {HTMLFormElement} form - The form element to set the data in.
 */
export const setFormData = (data, form) => {
  /**
   * Reviews the form and sets the values based on the data object.
   */
  const reviewForm = () => {
    // loop through all the form's elements and check
    // to see if there is ia matching key in the data
    // and if so, set the form's element's value to the
    // corresponding data in the object
    const elements = form.querySelectorAll("input, select, textarea");

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const key = element.name;

      if (data[key] !== undefined) {
        if (element.type === "checkbox") {
          // if the element is a checkbox, then we need to
          // set the checked property instead of the value
          if (data[key] === true) {
            element.checked = true;
          } else {
            element.removeAttribute("checked");
          }
        } else if (element.tagName === "Select") {
          // if the element is a select, then we need to
          // loop through the options and set the selected
          // property instead of the value
          const options = element.querySelectorAll("option");

          for (let i = 0; i < options.length; i++) {
            const option = options[i];

            if (option.value === data[key]) {
              option.selected = true;
            } else {
              option.selected = false;
            }
          }
        } else {
          // otherwise, just set the value
          element.value = data[key];
        }
      }
    }
  };

  // run after a 500ms timeout to allow the dom to catch up, if necessary
  setTimeout(() => {
    reviewForm();
  }, 500);
};
