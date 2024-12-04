/**
 * DataEmit
 * @module dataEmit
 * @description emits data to elements
 * @param {string} key the key to emit to
 * @param {string} value the value to emit
 */

import { addEventDelegate } from "../eventDelegate/eventDelegate.js";

export const dataEmit = (key, value, listener = false) => {
  // get all elements with a data-emit attribute
  const elements = document.querySelectorAll("[data-emit]");

  // loop through the elements
  elements.forEach((element) => {
    const emits = element.dataset.emit?.split(",") || [],
      emitTos = element.dataset.emitTo?.split(",") || [],
      emitValues = element.dataset.emitValue?.split(",") || [],
      emitGt = element.dataset.emitGt?.split(",") || [],
      emitLt = element.dataset.emitLt?.split(",") || [],
      emitEq = element.dataset.emitEq?.split(",") || [],
      emitNeq = element.dataset.emitNeq?.split(",") || [],
      emitGte = element.dataset.emitGte?.split(",") || [],
      emitLte = element.dataset.emitLte?.split(",") || [];

    for (let i = 0; i < emits.length; i++) {
      const emit = emits[i]?.trim(),
        emitTo = emitTos[i]?.trim(),
        emitValue = emitValues[i]?.trim(),
        gt = emitGt[i]?.trim(),
        lt = emitLt[i]?.trim(),
        eq = emitEq[i]?.trim(),
        neq = emitNeq[i]?.trim(),
        gte = emitGte[i]?.trim(),
        lte = emitLte[i]?.trim();

      // check if we are bound to this key
      if (emit === key) {
        const conditions = {};

        if (gt !== undefined) conditions.gt = gt;
        if (lt !== undefined) conditions.lt = lt;
        if (eq !== undefined) conditions.eq = eq;
        if (neq !== undefined) conditions.neq = neq;
        if (gte !== undefined) conditions.gte = gte;
        if (lte !== undefined) conditions.lte = lte;

        // default conditionsMet to true
        let conditionsMet = true;

        // check if this is a simple condition or a complex condition
        if (Object.keys(conditions).length === 0) {
          // if it is a simple condition, check if the value is truthy
          if (value !== false && value !== undefined && value !== null) {
            conditionsMet = true;
          } else {
            conditionsMet = false;
          }
        } else {
          // loop through the conditions
          for (const condition in conditions) {
            // get the condition value
            const conditionValue = conditions[condition];

            // if the condition exists
            if (conditionValue !== undefined) {
              // check for greater than condition
              if (condition === "gt") {
                // if the value is greater than the condition value
                if (value > conditionValue) {
                  continue;
                } else {
                  // otherwise, the conditions are not met
                  conditionsMet = false;
                  break;
                }
                // check for less than condition
              } else if (condition === "lt") {
                // if the value is less than the condition value
                if (value < conditionValue) {
                  continue;
                } else {
                  // otherwise, the conditions are not met
                  conditionsMet = false;
                  break;
                }
                // check for equal to condition
              } else if (condition === "eq") {
                // if the value is equal to the condition value
                if (value === conditionValue) {
                  continue;
                } else {
                  // otherwise, the conditions are not met
                  conditionsMet = false;
                  break;
                }
                // check for not equal to condition
              } else if (condition === "neq") {
                // if the value is not equal to the condition value
                if (value !== conditionValue) {
                  continue;
                } else {
                  // otherwise, the conditions are not met
                  conditionsMet = false;
                  break;
                }
                // check for greater than or equal to condition
              } else if (condition === "gte") {
                // if the value is greater than or equal to the condition value
                if (value >= conditionValue) {
                  continue;
                } else {
                  // otherwise, the conditions are not met
                  conditionsMet = false;
                  break;
                }
                // check for less than or equal to condition
              } else if (condition === "lte") {
                // if the value is less than or equal to the condition value
                if (value <= conditionValue) {
                  continue;
                } else {
                  // otherwise, the conditions are not met
                  conditionsMet = false;
                  break;
                }
              }
            }
          }
        }

        // if the conditions are met
        if (conditionsMet) {
          // if this was triggered by a listener, then set
          // the data-listening attribute to true
          // if (listener) {
          //   element.dataset.listening = true;
          // }

          // set the data-bound attribute to true
          element.dataset.bound = true;

          // if there is a emitValue, use that
          if (emitTo !== undefined) {
            // set the new value
            let newValue = emitValue !== undefined ? emitValue : value;

            if (emitTo === "class") {
              element.classList.add(newValue);
            } else if (emitTo === "checked") {
              element.setAttribute("checked", true);
            } else {
              element.setAttribute(emitTo, newValue);
            }
          } else {
            // otherwise use the textcontent
            // if there is a emitValue, use that
            if (emitValue !== undefined) {
              element.textContent = emitValue;
            } else {
              // otherwise use the value
              element.textContent = value;
            }
          }
        } else {
          // otherwise, remove the data-bound attribute
          delete element.dataset.bound;

          if (emitTo !== undefined) {
            // remove the bound value from the attribute
            let newValue = emitValue !== undefined ? emitValue : value;

            if (emitTo === "class") {
              element.classList.remove(newValue);
            } else if (emitTo === "checked") {
              element.removeAttribute("checked");
            } else {
              element.setAttribute(emitTo, "");
            }
          }
        }

        // if this was triggered by a listener, then remove
        // the data-listening attribute
        // if (listener) {
        //   delete element.dataset.listening;
        // }
      }
    }
  });
};

// export const dataEmitListener = () => {
//   const listener = (element, event) => {
//     const key = element.dataset.emit;

//     let value;

//     if (element.type === "checkbox") {
//       value = element.checked;
//     } else if (element.value !== undefined) {
//       value = element.value;
//     } else {
//       value = element.textContent;
//     }

//     // dataEmit(key, value, true);
//   };

//   addEventDelegate(
//     "change, input, attributes:class, attributes:id, attributes:value, attributes.checked",
//     "[data-emit]:not([data-listening])",
//     listener
//   );
// };
