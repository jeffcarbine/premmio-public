// Modules
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import {
  camelize,
  deCamelize,
} from "../../modules/formatString/formatString.js";

// Components
import { Icon } from "../icon/icon.html.js";

// Elements
import { Button, Img, Span, Ul, Li } from "../../template/elements.html.js";

/**
 * Class representing an array entry field.
 */
export class Field__ArrayEntry {
  constructor(params = "", chipStyle = false) {
    this.class = `arrayEntry ${chipStyle ? "chip" : ""}`;
    this.children = [
      params,
      new Button({
        type: "button",
        class: "arrayEntry__remove",
        child: new Icon("close"),
      }),
    ];
  }
}

/**
 * Class representing a form field.
 */
export class Field {
  constructor(params = {}) {
    // if there is an if param, check if it is true
    // if not, return null
    if (params.if !== undefined && params.if === false) {
      return null;
    }

    // set the data-component attribute
    this["data-component"] = "field";

    // set the readonly attribute
    this.readonly = params.readonly;

    // set the data-name attribute
    this["data-name"] = params.name;

    // set the id of the field to id-field
    if (params.id) {
      this.id = `${params.id}-field`;
    }

    // default to text type if no type is provided
    const type = params.type || "text";

    if (params.bind) {
      this.bind = params.bind;
    }

    // check to see if this is a typed input
    const typedTypes = [
      "text",
      "password",
      "email",
      "number",
      "date",
      "time",
      "richtext",
      "url",
      "tel",
      "textarea",
      "select",
      "array",
      "file",
      "simplecurrency",
      "simpledate",
    ];

    const typed = typedTypes.includes(type);

    // set the class name for object
    this.class = `field ${type}-field ${typed ? "typed" : ""} ${
      params.className || ""
    }`;

    // create the input/textarea element
    let input = {
      tagName: "input",
    };

    // if it is readonly, set the readonly attribute
    if (params.readonly) {
      input.readonly = true;
    }

    // if it is a date, format the value
    if (type === "date") {
      params.value = params.value
        ? new Date(params.value).toISOString().split("T")[0]
        : "";
    }

    // if type is textarea, change the input to a textarea
    if (type === "textarea" || type === "richtext") {
      input.tagName = "textarea";
      input.innerHTML = params.value || "";

      // if no rows, default to 4
      if (!params.rows) {
        params.rows = 6;
      }
      // if the type is select, change the input to a select
    } else if (type === "select") {
      input.tagName = "select";
    } else {
      // assign the type attribute
      input.type = type;
    }

    // if no id, but name then id = name
    if (!params.id && params.name) {
      params.id = `${params.name}-${generateUniqueId(5)}`;
    } else if (!params.id) {
      // otherwise generate a unique id
      params.id = generateUniqueId(5);
    }

    // all the keys we want to skip
    const skipKeys = [
      "type",
      "label",
      "preview",
      "options",
      "selected",
      "style",
    ];

    // assign all other params to the input
    for (let key in params) {
      if (!skipKeys.includes(key)) {
        input[key] = params[key];
      }
    }

    // if there's a style, add it to the field
    if (params.style) {
      this.style = params.style;
    }

    // put that inside of the input wrapper
    const wrapper = {
      class: `wrapper ${typed ? "typed" : ""} ${
        params.label ? "hasLabel" : "noLabel"
      }`,
      // "data-emit": `${params.name}--validation`,
      // "data-emit-neq": "",
      // "data-emit-to": "class",
      // "data-emit-value": "invalid",
      children: [input],
    };

    const focus = {
      tag: "span",
      class: "focus",
    };

    // insert the focus into the wrapper children if it is a typed input
    if (typed) {
      wrapper.children.push(focus);
    }

    // if there is a buttonIcon, add it to the wrapper
    if (params.buttonIcon) {
      wrapper.class += " hasButton";

      wrapper.children.push({
        tagName: "button",
        type: "button",
        class: `inputButton ${params.buttonClass || ""}`,
        child: new Icon(params.buttonIcon),
      });
    }

    //
    //
    //
    // MODIFICATIONS
    // these are modifications to the field depending on type
    //
    //
    //

    //
    //
    // Select
    // if a select field, create the options
    if (type === "select") {
      input.children = [];

      const optionValue = (option) => {
        if (typeof option === "string") {
          return camelize(option);
        } else if (typeof option === "number") {
          return option;
        } else {
          return option.value;
        }
      };

      params.options.forEach((option, index) => {
        let optionObj;

        if (typeof option === "string" || typeof option === "number") {
          optionObj = {};
        } else {
          optionObj = option;
        }

        const optionParams = {
          tagName: "option",
          value: optionValue(option),
          textContent:
            typeof option === "string" || typeof option === "number"
              ? option
              : option.name,
          ...optionObj,
        };

        if (index === 0 && option.help !== undefined) {
          // set theh params.help to the first one, which will be overwritten if there is a selected option
          params.help = option.help;
        }

        // if there is a disabled option, add it
        if (option.disabled !== undefined && option.disabled === true) {
          optionParams.disabled = true;
        }

        // if there is a help value, add it
        if (option.help !== undefined) {
          optionParams["data-help"] = option.help;
        }

        if (params.selected !== undefined) {
          if (option === params.selected || option.value === params.selected) {
            optionParams.selected = true;
            params.help = option.help;
          }
        }

        input.children.push(optionParams);
      });
    }

    //
    //
    // SIMPLEDATE
    // if this is a simpledate, we need to create the hidden input
    if (type === "simpledate") {
      const hidden = {
        tagName: "input",
        type: "hidden",
        name: params.name,
        value: params.value,
      };

      // and change the input's name to
      input.name = `${params.name}__Date`;

      // and the type to date
      input.type = "date";

      // and add a data attribute
      input["data-simpledate"] = params.name;

      // and convert the YYYYMMDD number to YYYY-MM-DD string
      if (params.value) {
        const year = params.value.toString().slice(0, 4),
          month = params.value.toString().slice(4, 6),
          day = params.value.toString().slice(6, 8);

        input.value = `${year}-${month}-${day}`;
      }

      wrapper.children.push(hidden);
    }

    //
    //
    // CURRENCY OR SIMPLECURRENCY
    // if this is a currency, we need to add the prefix
    if (type === "currency" || type === "simplecurrency") {
      wrapper.children.unshift({
        class: "prefix",
        textContent: "$",
      });

      // add the has-prefix class to the wrapper
      wrapper.class += " has-prefix";

      // and change the type to number
      input.type = "number";

      // and make the input value null
      input.value = null;
    }

    //
    //
    // SIMPLECURRENCY
    if (type === "simplecurrency") {
      // if simplecurrency, we need to add the hidden input
      const hidden = {
        tagName: "input",
        type: "hidden",
        name: params.name,
        value: params.value || null,
      };

      wrapper.children.push(hidden);

      // and change the input's name to
      input.name = `${params.name}__Number`;

      // and add a data attribute
      input["data-simplecurrency"] = params.name;
    }

    //
    //
    // FUlLCHECKBOX OR FUlLRADIO
    if (type === "fullcheckbox" || type === "fullradio") {
      input.type = type.replace("full", "");
      wrapper.class += ` ${type}`;
    }

    //
    //
    // CHECKBOX, FUlLCHECKBOX, RADIO OR FUlLRADIO
    if (
      type === "checkbox" ||
      type === "fullcheckbox" ||
      type === "radio" ||
      type === "fullradio" ||
      type === "togglesingle"
    ) {
      wrapper["data-checked"] = params.checked;

      if (type === "checkbox" || type === "radio") {
        // add the pseudo checkbox/radio/toggle after the input
        // but before the focus span
        wrapper.children.splice(1, 0, {
          class: "pseudo",
        });
      }

      if (params.checked == false) {
        delete input.checked;
      }
    }

    //
    //
    // ARRAY
    if (type === "array") {
      // then we need to create multiple checkbox/label pairs out of
      // the comma-separated array param and place them inside the wrapper
      // and make the input hidden
      input.type = "hidden";
      // conver the array to comma separated string
      input.value = params?.value?.join(",") || "";
      ``;

      // if options are provided, then generate a series of checkboxes
      // for each of the predetermined options
      if (params.options) {
        if (params.selector === "select") {
          // create the arrayEntries component
          const arrayEntries = {
            class: `arrayEntries ${
              params.arrayStyle === "chip" ? "chip-style" : ""
            }`,
            children: [],
          };

          // and process any of the values, if any, that are already in the array
          // and add them as Field__ArrayEntry
          if (params.value) {
            params.value.forEach((item) => {
              let itemText;

              // if the item is an object, then we need to get the value
              if (typeof item === "object") {
                itemText = item.text;
              } else {
                itemText = item;
              }

              const subField = new Field__ArrayEntry(itemText);

              arrayEntries.children.push(subField);
            });
          }

          // then we need to create a select element that contains
          // the options
          const subField = new Field({
            type: "select",
            "data-input": params.id,
            name: `${params.name}__select`,
            options: [
              {
                value: "",
                name: "Select an option",
                disabled: true,
                selected: true,
              },
              ...params.options,
            ],
            selected: params.value,
          });

          wrapper.children.push(arrayEntries, subField);
        } else {
          // if the selector is togglesingle, then type is togglesingle, otherwise checkbox
          const subType =
            params.selector === "togglesingle" ? "togglesingle" : "checkbox";

          wrapper.class += " hasOptions";

          const arr = Array.isArray(params.options)
            ? params.options
            : params.options.split(",");

          arr.forEach((item) => {
            let label, value;

            if (typeof item === "object") {
              label = item.name;
              value = item.value;
            } else {
              label = deCamelize(item);
              value = item;
            }

            const subField = new Field({
              type: subType,
              id: `${params.id}__${item}`,
              name: `${params.name}__${item}`,
              label,
              "data-input": params.id,
              checked: params.value.includes(value),
              value,
            });

            wrapper.children.push(subField);
          });
        }
      } else {
        // otherwise, create a holder for the array tags
        const arrayEntries = {
          class: `arrayEntries ${
            params.arrayStyle === "chip" ? "chip-style" : ""
          }`,
          children: [],
        };

        // and process any of the values, if any, that are already in the array
        // and add them as Field__ArrayEntry
        if (params.value) {
          params.value.forEach((item) => {
            if (item !== "") {
              const subField = new Field__ArrayEntry(item);
              arrayEntries.children.push(subField);
            }
          });
        }

        // and a text input for adding new values to the array
        const subField = new Field({
          type: "text",
          name: `${params.name}__new`,
          label: "Add New",
          "data-input": params.id,
          buttonIcon: "plus",
          buttonClass: "array__add",
          placeholder: params.placeholder || null,
        });

        wrapper.children.push(arrayEntries, subField);
      }

      // then make the wrapper a fieldset
      wrapper.tagName = "fieldset";

      // create a legend inside the wrapper
      if (params.label) {
        wrapper.children.unshift({
          tagName: "legend",
          textContent: params.label,
        });
      }

      // and then null out the label so it doesn't render
      params.label = null;
    }

    //
    //
    // ToggleSingle
    if (type === "togglesingle") {
      // then we need to create a single checkbox
      // using the input as the value

      // modify the input
      input.type = "checkbox";

      if (params.checked) {
        input.checked = params.checked;
      }

      // and create the toggle element
      const toggle = {
        class: "toggle",
      };

      // check to see if there is a checkedIcon and uncheckedIcon value
      // and add them to the toggle as children
      if (params.checkedIcon) {
        if (!toggle.children) toggle.children = [];

        toggle.children.push({
          class: "checkedIcon",
          child: new Icon(params.checkedIcon),
        });
      }

      if (params.uncheckedIcon) {
        if (!toggle.children) toggle.children = [];

        toggle.children.push({
          class: "uncheckedIcon",
          child: new Icon(params.uncheckedIcon),
        });
      }

      // put the label and input into the wrapper
      wrapper.children.push(toggle);
    }

    //
    //
    //  ToggleDual
    if (type === "toggledual") {
      // then we need to create two radio buttons
      // using the input as the first value and
      // a new input as a second value

      // modify the first input
      input.type = "radio";
      input.value = params.values[0];
      input.id = `${params.id}--${params.values[0]}`;
      input["data-number"] = 1;

      // create the second input
      const input2 = {
        tagName: "input",
        type: "radio",
        name: params.name,
        value: params.values[1],
        id: `${params.id}--${params.values[1]}`,
        "data-number": 2,
      };

      // if the checked value is the same as the second value
      // then set the input to checked and the wrapper data-toggled
      if (params.checked === params.values[1]) {
        input2.checked = true;
        wrapper["data-toggled"] = 2;
      } else {
        // set it to the first value
        input.checked = true;
        wrapper["data-toggled"] = 1;
      }

      // and create the toggle element
      const toggle = {
        class: "toggle",
      };

      // if there is an icons array, then add the icons to the inside
      // of the toggle
      if (params.icons) {
        toggle.children = [];
        params.icons.forEach((icon) => {
          toggle.children.push(new Icon(icon));
        });
      }

      if (params.labels) {
        // create the first label
        const label1 = {
          tagName: "label",
          textContent: params.labels[0],
          for: `${params.id}--${params.values[0]}`,
        };
        // create the second label
        const label2 = {
          tagName: "label",
          textContent: params.labels[1],
          for: `${params.id}--${params.values[1]}`,
        };

        wrapper.children.push(label1, toggle, input2, label2);
      } else {
        wrapper.children.push(toggle, input2);
      }
    }

    //
    //
    // RICHTEXT
    if (type === "richtext") {
      input.rows = 8;

      // create the rich text editor
      const richText = {
        class: "richText",
        "data-input": params.id,
        child: {
          class: "quill",
          innerHTML: params.value || "",
        },
      };

      // and add it to the wrapper
      wrapper.children.unshift(richText);
    }

    //
    //
    // END MODIFICATIONS
    //
    //

    // create the label element
    let label;

    // if there is a label, create it
    if (params.label) {
      label = {
        tagName: "label",
        children: [
          params.required
            ? new Span({ class: "required", "aria-label": "Required" })
            : null,
        ],
        for: params.id,
      };

      if (Array.isArray(params.label)) {
        label.children.push(...params.label);
      } else {
        label.children.push(params.label);
      }
    }

    // create the validation element
    const validation = {
      tagName: "span",
      class: "validation",
      // "data-emit": `${params.name}--validation`,
    };

    // create the help element
    const help = {
      tagName: "span",
      class: "help",
      // "data-emit": `${params.name}--help`,
    };

    // check the type of help that is coming in
    if (typeof params.help === "string") {
      help.textContent = params.help;
    } else if (Array.isArray(params.help)) {
      help.children = params.help;
    } else if (typeof params.help === "object") {
      help.child = params.help;
    }

    // set the children
    this.children = [wrapper, help, validation];

    // put the label second if checkbox or radio or togglesingle
    if (type === "checkbox" || type === "radio" || type === "togglesingle") {
      // if label, put it at index 1
      if (label) {
        this.children.splice(1, 0, label);
      }
    } else if (type === "fullradio" || type === "fullcheckbox") {
      // if label, put inside the wrapper as index 1
      if (label) {
        wrapper.children.splice(1, 0, label);
      }
    } else {
      // if label, put it at index 0
      if (label) {
        this.children.splice(0, 0, label);
      }
    }

    // if there is a preview, prepend it to the children
    if (type === "file" && /^image\//.test(params.accept)) {
      input.class = `${
        input.class !== undefined ? input.class : ""
      } hasPreview`;

      const preview = {
        class: "preview",
        children: [
          new Img({
            class: "previewImage",
            src: params.value || "",
          }),
        ],
      };

      // place the preview before the input in the wrapper
      wrapper.children.unshift(preview);

      // and give the wrapper a hasPreview class
      wrapper.class += " hasPreview";
    }

    // if this is a reordder, then make the input hidden
    // and add the reorganize ui
    if (type === "reorder") {
      input.type = "hidden";

      // if the params.value is an array of objects, then we need to
      // reduce it to an array of the object's values and pass that as
      // the input value
      if (Array.isArray(params.value)) {
        input.value = params.value.map((item) => item.value).join(",");
      }

      const generateReorderListItems = () => {
        const arr = Array.isArray(params.value)
            ? params.value
            : params.value.split(","),
          reorderListItems = [];

        arr.forEach((item, index) => {
          const listItem = new Li({
            class: "reorderItem",
            "data-originalindex": index,
            "data-value": item.value || item,
            children: [
              {
                class: "handle",
                role: "button",
                "aria-label": "Drag item",
                child: new Icon("dragHandle"),
              },
              new Span(item.name || item),
            ],
          });

          reorderListItems.push(listItem);
        });

        return reorderListItems;
      };

      const reorganizeList = new Ul({
        class: "reorderList",
        children: generateReorderListItems(),
      });

      // and add it to the wrapper
      wrapper.children.unshift(reorganizeList);

      // and add an overflow-visible class
      wrapper.class += " overflow-visible";
    }
  }
}
