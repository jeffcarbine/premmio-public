import { renderTemplate } from "../../template/renderTemplate.js";
import { xhr } from "../xhr/xhr.js";

export const dataBind = (_data, template) => {
  // get the name of the variable we are binding to
  const bindKey = Object.keys(_data)[0],
    obj = _data[bindKey],
    // and get all the elements bound to this bindKey
    elements = document.querySelectorAll(`[data-bind="${bindKey}"]`);

  const handler = {
    set(target, prop, value) {
      // skip undefined and length values
      if (prop !== undefined && prop !== "length") {
        // set the target property to the value
        target[prop] = value;

        // if a template is passed, then we need to regenerate the template
        // using the target object and append it to the corresponding elements
        if (template) {
          const renderedTemplate = renderTemplate(
            template(target, `${bindKey}[${prop}]`)
          );

          elements.forEach((element) => {
            element.replaceChildren();
            element.classList.remove("loading");
            element.appendChild(renderedTemplate);
          });
        } else {
          // then we need to update the corresponding elements accordingly
          // loop through the elements
          elements.forEach((element) => {
            const gt = element.dataset.bindGt,
              lt = element.dataset.bindLt,
              eq = element.dataset.bindEq,
              neq = element.dataset.bindNeq,
              gte = element.dataset.bindGte,
              lte = element.dataset.bindLte;

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

            // get the value we are binding to
            const bindTo = element.dataset.bindTo,
              bindValue = element.dataset.bindValue;

            // if the conditions are met
            if (conditionsMet) {
              // if there is a bindValue, use that
              if (bindTo !== undefined) {
                // get the original value of the attribute
                const attributeValue = element.getAttribute(bindTo) || "";
                let newValue = bindValue !== undefined ? bindValue : value,
                  newAttributeValue = !attributeValue.includes(newValue)
                    ? `${attributeValue} ${newValue}`
                    : attributeValue;

                element.setAttribute(bindTo, newAttributeValue);
              } else {
                // otherwise use the textcontent
                // if there is a bindValue, use that
                if (bindValue !== undefined) {
                  element.textContent = bindValue;
                } else {
                  // otherwise use the value
                  element.textContent = value;
                }
              }
            } else {
              if (bindTo !== undefined) {
                // remove the bound value from the attribute
                const attributeValue = element.getAttribute(bindTo) || "";
                let newValue = bindValue !== undefined ? bindValue : value,
                  newAttributeValue = attributeValue
                    .replace(newValue, "")
                    .trim();

                element.setAttribute(bindTo, newAttributeValue);
              }
            }
          });
        }

        if (target.xhr) {
          // not quite good enough, we need to identify WHAT was changed
          // specifically about the target object
          //xhr({ path: target.xhr, body: target.data });
        }
      }

      return true;
    },
  };

  return new Proxy(obj, handler);
};

export class bindObj {
  constructor(params) {
    this.data = params?.data || null;
    this.xhr = params?.xhr || null;
  }
}
