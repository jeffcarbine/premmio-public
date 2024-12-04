// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { Field__ArrayEntry } from "./field.html.js";

/**
 * Handles focus event on an input field.
 *
 * @param {HTMLElement} target - The target input element.
 * @param {Event} event - The focus event.
 */
const handleFocus = (target, event) => {
  const clientX = event.clientX;
  const elemX = target.getBoundingClientRect().left;
  const xPos = clientX - elemX;
  const focus = target.parentNode.querySelector(".focus");

  focus.style.left = xPos + "px";
};

/**
 * Renders an image preview for an input field.
 *
 * @param {HTMLInputElement} input - The input element.
 */
const renderImagePreview = (input) => {
  if (!input.files || !input.files[0]) return;

  const FR = new FileReader();

  FR.addEventListener("load", (evt) => {
    const imagePreviews = input.parentNode.querySelectorAll(".imagePreview");

    imagePreviews.forEach((imagePreview) => {
      imagePreview.src = evt.target.result;
      imagePreview.style.opacity = 1;
    });
  });

  FR.readAsDataURL(input.files[0]);
};

/**
 * Creates a resized image and appends it to the wrapper.
 *
 * @param {string} datas - The data URI of the image.
 * @param {HTMLImageElement} img - The image element.
 * @param {number} maxWidth - The maximum width of the resized image.
 * @param {number} maxHeight - The maximum height of the resized image.
 * @param {HTMLElement} wrapper - The wrapper element to append the resized image.
 * @param {string} name - The name of the hidden input.
 * @param {string} size - The size label for the hidden input.
 */
const createResizedImage = (
  datas,
  img,
  maxWidth,
  maxHeight,
  wrapper,
  name,
  size
) => {
  if (img.width <= maxWidth && img.height <= maxHeight) {
    // no need to resize
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = `${name}_${size}`;
    hiddenInput.value = null;

    // and append it to the wrapper
    wrapper.appendChild(hiddenInput);
    return;
  }

  // get the type/extension from the base64
  const type = datas.split(";")[0].split(":")[1];

  // We create an image to receive the Data URI
  var img = document.createElement("img");

  // When the event "onload" is triggered we can resize the image.
  img.onload = function () {
    // We create a canvas and get its context.
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    let scale = 1;

    if (img.width < maxWidth) {
      scale = maxWidth / img.width;
    } else {
      scale = maxHeight / img.height;
    }
    let newWidth = img.width * scale;
    let newHeight = img.height * scale;

    // We set the dimensions at the wanted size.
    canvas.width = newWidth;
    canvas.height = newHeight;

    // We resize the image with the canvas method drawImage();
    ctx.drawImage(this, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);

    var dataURI = canvas.toDataURL(type);

    // now create a new hidden input
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = `${name}_${size}`;
    hiddenInput.value = dataURI;

    // and append it to the wrapper
    wrapper.appendChild(hiddenInput);
  };

  // We put the Data URI in the image's src attribute
  img.src = datas;
};

/**
 * Creates a base64 string for a file input.
 *
 * @param {HTMLInputElement} input - The input element.
 */
// const createBase64String = (input) => {
//   if (!input.files || !input.files[0]) return;

//   if (input.files[0].size > 40000000) {
//     const name = input.name;

//     dataEmit(`${name}--validation`, "Filesize is too large.");

//     input.value = "";
//     return;
//   }

//   const FR = new FileReader();

//   FR.addEventListener("load", (evt) => {
//     const wrapper = input.parentNode,
//       base64file = wrapper.querySelector("input[type=hidden]"),
//       name = base64file.name;

//     base64file.value = evt.target.result;

//     // if the file is an image, create resized images
//     if (input.files[0] && input.files[0].type.startsWith("image/")) {
//       var img = new Image();

//       // remove any existing hidden image size inputs
//       const hiddenImageSizeInputs = wrapper.querySelectorAll(
//         "input[type=hidden][name^=image_]"
//       );

//       if (hiddenImageSizeInputs.length > 0) {
//         hiddenImageSizeInputs.forEach((input) => {
//           input.remove();
//         });
//       }

//       img.onload = () => {
//         // clear out the validation message
//         dataEmit(`${name}--validation`, "");

//         // create resized images if not an svg
//         if (input.files[0].type !== "image/svg+xml") {
//           // create large, medium, small and thumnbail images
//           createResizedImage(
//             evt.target.result,
//             img,
//             1600,
//             1600,
//             wrapper,
//             name,
//             "lg"
//           );

//           createResizedImage(
//             evt.target.result,
//             img,
//             1000,
//             1000,
//             wrapper,
//             name,
//             "md"
//           );

//           createResizedImage(
//             evt.target.result,
//             img,
//             500,
//             500,
//             wrapper,
//             name,
//             "sm"
//           );

//           createResizedImage(
//             evt.target.result,
//             img,
//             100,
//             100,
//             wrapper,
//             name,
//             "xs"
//           );
//         }
//       };

//       img.onerror = () => {
//         dataEmit(
//           `${name}--validation`,
//           "Filesize is too large. Please upload a smaller file."
//         );

//         // clear out the base64 input and the file input
//         base64file.value = "";
//         input.value = "";
//       };

//       img.src = FR.result; // is the data URL because called with readAsDataURL
//     }
//   });

//   FR.readAsDataURL(input.files[0]);
// };

/**
 * Validates fields and displays validation messages.
 *
 * @param {Array<Object>} messages - The validation messages.
 */
export const validateFields = (messages) => {
  // loop through the messages, and pass the message to the appropriate field

  messages.forEach((message) => {
    const field = document.querySelector(`.field[data-name=${message.field}]]`);

    if (!field) return;

    const validation = field.querySelector(".validation");

    if (!validation) return;

    validation.innerHTML = message.message;
  });
};

/**
 * Toggles visibility of elements based on the selected value of a select input.
 *
 * @param {HTMLSelectElement} selectInput - The select input element.
 */
const toggleVisibilityWithSelect = (selectInput) => {
  const query = selectInput.dataset.targets,
    value = selectInput.value,
    targets = document.querySelectorAll(query);

  targets.forEach((target) => {
    if (target.classList.contains(value)) {
      target.classList.add("visible");
    } else {
      target.classList.remove("visible");
    }
  });
};

// make the selected hidden input group visible
const hiddenInputGroupSelects = document.querySelectorAll(
  ".field select[data-targets]"
);

if (hiddenInputGroupSelects.length > 0) {
  hiddenInputGroupSelects.forEach((hiddenInputGroupSelect) => {
    toggleVisibilityWithSelect(hiddenInputGroupSelect);
  });
}

/**
 * Handles mutations for hidden input groups.
 *
 * @param {HTMLElement} element - The element to handle mutations for.
 */
const handleHiddenGroupMutations = (element) => {
  toggleVisibilityWithSelect(element);
};

/**
 * Toggles visibility of elements based on the checked state of a checkbox.
 *
 * @param {HTMLInputElement} checkbox - The checkbox input element.
 */
const toggleVisibilityWithCheckbox = (checkbox) => {
  const query = checkbox.dataset.targets,
    checked = checkbox.checked,
    targets = document.querySelectorAll(query);

  targets.forEach((target) => {
    if (checked) {
      target.classList.remove("hidden");
    } else {
      target.classList.add("hidden");
    }
  });
};

// reorder list scripts (new!)

let reordering = false,
  draggingItem = null;

/**
 * Starts the reordering process for a list item.
 *
 * @param {HTMLElement} button - The button element that triggers the reorder.
 */
const reorderItemStart = (button) => {
  if (!reordering) {
    const item = button.parentNode;
    item.classList.add("dragging");
    draggingItem = item;
    reordering = true;
  }
};

/**
 * Moves the reordered item to its new position.
 *
 * @param {HTMLElement} button - The button element that triggers the reorder.
 * @param {Event} e - The mousemove or touchmove event.
 */
const reorderItemMove = (button, e) => {
  if (reordering) {
    const reorderList = draggingItem.parentNode,
      // get the clientY relative to the reorderList
      clientY = e.clientY - reorderList.getBoundingClientRect().top;

    // Getting all items except currently dragging and making array of them
    let siblings = [
      ...reorderList.querySelectorAll(".reorderItem:not(.dragging)"),
    ];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find((sibling) => {
      return clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    reorderList.insertBefore(draggingItem, nextSibling);

    // now, get all of the items in the list, pull their values, and set
    // the value of the hidden input
    const hiddenInput = reorderList.nextElementSibling;
    const value = [...reorderList.querySelectorAll(".reorderItem")].map(
      (item) => item.dataset.value
    );

    hiddenInput.value = value.join(",");
  }
};

/**
 * Ends the reordering of an item.
 */
const reorderItemEnd = () => {
  if (reordering) {
    draggingItem.classList.remove("dragging");
    draggingItem = null;
    reordering = false;
  }
};

// /**
//  * Handles the help text for the selected option in a select element.
//  *
//  * @param {HTMLSelectElement} select - The select element to handle.
//  */
// const handleSelectOptionHelp = (select) => {
//   const name = select.name,
//     selectedOption = select.options[select.selectedIndex],
//     help = selectedOption.dataset.help;

//   dataEmit(`${name}--help`, help);
// };

// // handle the data-checked value of labels that contain checkboxes/radios/toggles
// const syncCheckedValue = (input) => {
//   const wrapper = input.parentNode;

//   if (input.checked) {
//     wrapper.dataset.checked = true;
//   } else {
//     delete wrapper.dataset.checked;
//   }
// };

// addEventDelegate("change", ".field.checkbox-field input", syncCheckedValue);

// // toggle checked on wrapper click
// const toggleChecked = (wrapper) => {
//   const input = wrapper.querySelector("input");

//   input.click();
// };

// addEventDelegate("click", ".field.checkbox-field .wrapper", toggleChecked);

/**
 * Converts a date input value to a simple date format.
 *
 * @param {HTMLInputElement} dateInput - The date input element to convert.
 */
const convertDateToSimpleDate = (dateInput) => {
  const date = dateInput.value,
    parent = dateInput.parentNode,
    simpledateName = dateInput.dataset.simpledate,
    simpleDateInput = parent.querySelector(`input[name=${simpledateName}]`);

  if (!simpleDateInput) return;

  const simpleDate = date.replace(/-/g, "");

  simpleDateInput.value = simpleDate;
};

/**
 * Toggles the checked property of a checkbox/radio input on pseudo element click.
 *
 * @param {HTMLElement} pseudo - The pseudo element to handle.
 */
const toggleChecked = (pseudo) => {
  const input = pseudo.parentNode.querySelector("input");

  // trigger a click event that bubbles
  const event = new MouseEvent("click", {
    bubbles: true,
  });

  input.dispatchEvent(event);
};

/**
 * Updates the hidden input that contains the values for the array field for a checkbox input.
 *
 * @param {HTMLInputElement} input - The checkbox input element to handle.
 */
const updateArrayInput__Checkbox = (input) => {
  const arrayInputId = input.dataset.input,
    arrayInput = document.querySelector(`input#${arrayInputId}`),
    wrapper = arrayInput.parentNode,
    values = [...wrapper.querySelectorAll("input:checked")].map(
      (input) => input.value
    );

  arrayInput.value = values.join(",");
};

// /**
//  * Synchronizes the checked value of the wrapper for toggledual fields.
//  *
//  * @param {HTMLInputElement} input - The input element to handle.
//  */
// const syncCheckedValue = (input) => {
//   // get the wrapper
//   const wrapper = input.parentNode;

//   if (input.checked) {
//     wrapper.dataset.toggled = input.dataset.number;
//   }
// };

/**
 * Toggles the checked property of a togglesingle input on toggle element click.
 *
 * @param {HTMLElement} toggle - The toggle element to handle.
 */
const toggleSingle = (toggle) => {
  const input = toggle.parentNode.querySelector("input");

  input.click();
};

/**
 * Toggles the checked property of a toggledual input on toggle element click.
 * @param {HTMLElement} toggle - The toggle element to handle.
 */
const toggleDual = (toggle) => {
  // get the unchecked input
  const input = toggle.parentNode.querySelector("input:not(:checked)");

  // trigger a click event that bubbles
  const event = new MouseEvent("click", {
    bubbles: true,
  });

  input.dispatchEvent(event);
};

// /**
//  * Synchronizes the checked value of the wrapper for togglesingle fields.
//  *
//  * @param {HTMLInputElement} input - The input element to handle.
//  */
// const syncSingleCheckedValue = (input) => {
//   // get the wrapper
//   const wrapper = input.parentNode;

//   if (input.checked) {
//     wrapper.dataset.checked = true;
//   } else {
//     wrapper.dataset.checked = false;
//   }
// };

const quillScriptImported = false;

/**
 * Enables Quill on richtext fields.
 *
 * @param {HTMLElement} quillField - The richtext field to enable Quill on.
 */
const enableQuillField = (quillField) => {
  if (!quillScriptImported) {
    import("https://cdn.quilljs.com/1.3.6/quill.js").then(() => {
      enable();
    });
  } else {
    enable();
  }

  const enable = () => {
    if (!quillField.classList.contains("ql-container")) {
      const quill = new Quill(quillField, {
        theme: "snow",
      });

      quill.on("text-change", function (delta, oldDelta, source) {
        if (source == "api") {
          console.info("An API call triggered this change.");
        } else if (source == "user") {
          const html = quill.root.innerHTML,
            textarea =
              quill.root.parentNode.parentNode.parentNode.querySelector(
                "textarea"
              );

          textarea.innerHTML = html.replace(/<p><br><\/p>/g, ""); // getting rid of the empty paragraph tags
        }
      });
    }
  };
};

const quillFields = document.querySelectorAll(".quill");

if (quillFields.length > 0) {
  quillFields.forEach((quillField) => {
    enableQuillField(quillField);
  });
}

addEventDelegate("childList", ".quill:not(.ql-container)", enableQuillField);

addEventDelegate("click", ".field.typed", handleFocus);

addEventDelegate("change", ".field input.hasPreview", renderImagePreview);

// addEventDelegate("change", ".field input[type=file]", createBase64String);

addEventDelegate(
  "childList",
  ".field select[data-targets]",
  handleHiddenGroupMutations
);

addEventDelegate(
  "change",
  ".field select[data-targets]",
  toggleVisibilityWithSelect
);

addEventDelegate(
  "change",
  ".field input[type='checkbox'][data-targets]",
  toggleVisibilityWithCheckbox
);

addEventDelegate(
  "touchstart, mousedown",
  ".reorderItem .handle",
  reorderItemStart
);

addEventDelegate("touchmove, mousemove", "body", reorderItemMove);

addEventDelegate("touchend, mouseup", "body", reorderItemEnd);

// addEventDelegate("change", ".field select", handleSelectOptionHelp);

addEventDelegate(
  "change",
  ".field input[data-simpledate]",
  convertDateToSimpleDate
);

addEventDelegate("click", ".field .pseudo", toggleChecked);

addEventDelegate(
  "change",
  ".field.array-field input[type='checkbox']",
  updateArrayInput__Checkbox
);

addEventDelegate("click", ".field.toggledual-field .toggle", toggleDual);

// addEventDelegate(
//   "change, attributes:checked",
//   ".field.toggledual-field input",
//   syncCheckedValue
// );

addEventDelegate("click", ".field.togglesingle-field .toggle", toggleSingle);

// addEventDelegate(
//   "change, attributes:checked",
//   ".field.togglesingle-field input",
//   syncSingleCheckedValue
// );

const handleSimpleCurrency = (input) => {
  const value = parseFloat(input.value),
    formatted = value.toFixed(2);

  input.value = formatted;

  const currency = input.value,
    parent = input.parentNode,
    simplecurrencyName = input.dataset.simplecurrency,
    simpleCurrencyInput = parent.querySelector(
      `input[name='${simplecurrencyName}']`
    );

  if (!simpleCurrencyInput) return;

  const simpleCurrency = currency * 100;

  simpleCurrencyInput.value = simpleCurrency;
};

addEventDelegate(
  "focusout",
  ".field input[data-simplecurrency]",
  handleSimpleCurrency
);

const syncSimpleCurrencyFromHidden = (input) => {
  const value = parseFloat(input.value / 100).toFixed(2);

  const simpecurrencyInput = input.parentNode.querySelector(
    "input[data-simplecurrency]"
  );

  simpecurrencyInput.value = value;
};

// get all the hidden simplecurrency inputs
const hiddenSimpleCurrencyInputs = document.querySelectorAll(
  ".simplecurrency-field input[type=hidden]"
);

if (hiddenSimpleCurrencyInputs.length > 0) {
  hiddenSimpleCurrencyInputs.forEach((input) => {
    syncSimpleCurrencyFromHidden(input);
  });
}

addEventDelegate(
  "childList",
  ".simplecurrency-field input[type=hidden]",
  syncSimpleCurrencyFromHidden
);

// add new items to the array field from a text input
const addToArrayButton = (button) => {
  const fieldset = button.parentNode.parentNode.parentNode,
    input = button.parentNode.querySelector("input"),
    value = input.value;

  addToArray(value, fieldset);

  input.value = "";
};

const addToArraySelect = (select) => {
  const fieldset = select.parentNode.parentNode.parentNode;

  let value;

  if (select.options[select.selectedIndex].getAttribute("value") !== null) {
    // create an object with the value and text
    value = JSON.stringify({
      value: select.options[select.selectedIndex].value,
      text: select.options[select.selectedIndex].text,
    });
  } else {
    value = select.options[select.selectedIndex].text;
  }

  addToArray(value, fieldset);
};

const addToArray = (value, fieldset) => {
  // only add if the value is not a blank string
  if (value.trim() !== "") {
    const arrayInput = fieldset.querySelector(`input[type=hidden]`),
      arrayInputValue = arrayInput.value,
      arrayInputValues = arrayInput.value ? arrayInputValue.split(",") : [];

    arrayInputValues.push(value);
    arrayInput.value = arrayInputValues.join(",");

    // now create a new arrayChip and push it to the arrayChips element
    const arrayEntries = fieldset.querySelector(".arrayEntries"),
      // if the value is a stringified object, we need to parse it and get the text value
      arrayChipValue = value.includes("{") ? JSON.parse(value).text : value;

    App.render(
      new Field__ArrayEntry({ textContent: arrayChipValue }),
      null,
      (arrayChip) => {
        arrayEntries.appendChild(arrayChip);
      }
    );
  }
};

// remove items from the array field by clicking the remove button in the arrayEntry button
const removeFromArray = (button) => {
  const fieldset = button.parentNode.parentNode.parentNode,
    arrayInput = fieldset.querySelector(`input[type=hidden]`),
    arrayInputValue = arrayInput.value,
    arrayInputValues = arrayInputValue.split(","),
    arrayEntry = button.parentNode,
    value = arrayEntry.textContent;

  // remove the value from the arrayInputValues
  const index = arrayInputValues.indexOf(value);
  arrayInputValues.splice(index, 1);
  arrayInput.value = arrayInputValues.join(",");

  arrayEntry.remove();
};

// when a text field in an array field is focused, prevent the enter key from submitting the form
// and instead add a new item to the array
const preventEnterSubmit = (input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const button = input.parentNode.querySelector(".array__add");
      addToArrayButton(button);
    }
  });
};

const arrayTextInputs = document.querySelectorAll(
  ".field.array-field input:not([type='hidden'])"
);

if (arrayTextInputs.length > 0) {
  arrayTextInputs.forEach((input) => {
    preventEnterSubmit(input);
  });
}

addEventDelegate(
  "click",
  ".field.array-field .arrayEntry__remove",
  removeFromArray
);
addEventDelegate("click", ".field.array-field .array__add", addToArrayButton);
addEventDelegate("change", ".field.array-field select", addToArraySelect);
addEventDelegate("childList", ".field.array-field input", preventEnterSubmit);
