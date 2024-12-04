import { Element } from "../element.html.js";
import {
  camelize,
  capitalizeAll,
  capitalize,
} from "../../modules/formatString/formatString.js";

export class Input extends Element {
  constructor(params) {
    super(params);
    this.tagName = "input";

    if (typeof params === "string") {
      this.name = params;
      this.id = params;
    }
  }
}

export class Label extends Element {
  constructor(params) {
    super(params);
    this.tagName = "label";
  }
}

export class Fieldset extends Element {
  constructor(params) {
    super(params);
    this.tagName = "fieldset";
  }
}

export class Legend extends Element {
  constructor(params) {
    super(params);
    this.tagName = "legend";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class LabelInput {
  constructor(params) {
    this.if = params.if;

    let inputParams = {},
      labelText;

    if (typeof params === "string") {
      inputParams.name = camelize(params);
      inputParams.id = camelize(params);
      labelText = capitalizeAll(params);
    } else {
      inputParams = params;
      labelText = params.label;
    }

    if (params.value !== undefined && params.value !== "") {
      this.class = "active";
    }

    this.tagName = "label";
    this.textContent = labelText;
    this.child = new Input(inputParams);
  }
}
export class TextInputAREA extends Element {
  constructor(params) {
    super(params);

    this.tagName = "textarea";
    this.rows = params.rows || 5;

    if (typeof params === "string") {
      this.name = params;
      this.id = params;
    }
  }
}

export class LabelTEXTAREA {
  constructor(params) {
    this.if = params.if;

    let textareaParams = {},
      labelText;

    if (typeof params === "string") {
      textareaParams.name = camelize(params);
      textareaParams.id = camelize(params);
      labelText = capitalizeAll(params);
    } else {
      textareaParams = params;
      labelText = params.label;
    }

    if (params.value !== undefined && params.value !== "") {
      this.class = "active";
    }

    this.tagName = "label";
    this.textContent = labelText;
    this.child = new TextInputAREA(textareaParams);
  }
}

export class EMAIL extends LabelInput {
  constructor(params = {}) {
    params.type = "email";

    if (params.name === undefined) {
      params.name = "email";
    }

    if (params.id === undefined) {
      params.id = "email";
    }

    if (params.label === undefined) {
      params.label = "Email";
    }

    super(params);
  }
}

export class MESSAGE extends LabelTEXTAREA {
  constructor(params) {
    if (params.name === undefined) {
      params.name = "message";
    }

    if (params.id === undefined) {
      params.id = "message";
    }

    if (params.label === undefined) {
      params.label = "Message";
    }

    super(params);
  }
}

export class FILE extends Input {
  constructor(params) {
    super(params);
    this.type = "file";
  }
}

export class HiddenInput extends Input {
  constructor(params) {
    super(params);

    this.type = "hidden";
  }
}

export class NUMBER {
  constructor({ type = "number", value = 0 } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new Input({ type, value });
  }
}

export class TextInput {
  constructor(params) {
    this.if = params.if;

    let inputParams = {},
      labelText;

    if (typeof params === "string") {
      inputParams.name = camelize(params);
      inputParams.id = camelize(params);
      labelText = capitalizeAll(params);
    } else {
      inputParams = params;
      labelText = params.label;
    }

    if (params.value !== undefined && params.value !== "") {
      this.class = "active";
    }

    this.tagName = "label";
    this.textContent = labelText;
    this.child = new Input(inputParams);
  }
}
export class PASSWORD {
  constructor({
    type = "password",
    name = "password",
    id = "password",
    label = "Password",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new Input({ type, name, id });
  }
}

export class PHONE {
  constructor({
    type = "tel",
    name = "phone",
    id = "phone",
    label = "Phone",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new Input({ type, name, id });
  }
}

export class DATE {
  constructor({
    type = "date",
    name = "date",
    id = "date",
    label = "Date",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new Input({ type, name, id, value });
  }
}

export class Option {
  constructor(params) {
    this.tagName = "option";

    if (typeof params === "string") {
      this.value = params;
      this.textContent = capitalizeAll(params);
    } else {
      for (let key in params) {
        this[key] = params[key];
      }
    }
  }
}

export class Select extends Element {
  constructor(params) {
    super(params);

    this.tagName = "select";
  }
}

export class SelectOption extends Select {
  constructor(params) {
    super(params);

    const options = [];

    this.children.forEach((child) => {
      let option;

      if (typeof child === "string") {
        option = new Option({
          textContent: capitalize(child),
          value: camelize(child),
        });
      } else {
        option = new Option({
          textContent: child.title,
          value: child.value,
        });
      }

      if (child === params.selected) {
        option.selected = true;
      }

      options.push(option);
    });

    this.children = options;
  }
}

export class CHECKBOX extends Input {
  constructor(params) {
    super(params);

    this.type = "checkbox";

    if (params.id === undefined) {
      this.id = params.value;
    }
  }
}

export class CHECKBOXLABEL {
  constructor(params) {
    this.class = "checkboxLabel";

    if (params.id === undefined) {
      params.id = params.value;
    }

    this.children = [
      new CHECKBOX(params),
      new Label({
        textContent: params.label,
        for: params.id,
      }),
    ];
  }
}

export class RADIO extends Input {
  constructor(params) {
    super(params);

    this.type = "radio";

    if (params.id === undefined) {
      this.id = params.value;
    }
  }
}

export class RadioInput {
  constructor(params) {
    this.class = `radioLabel ${params.class}`;
    // clear out params.class
    delete params.class;

    // set up the label
    const labelText = params.label,
      labelClass = params.labelClass;

    // create a data attribute for the input
    params["data-label"] = labelText;

    // clear out params.label
    delete params.label;
    delete params.labelClass;

    if (params.id === undefined) {
      params.id = params.value;
    }

    this.children = [
      new RADIO(params),
      new Label({
        textContent: labelText,
        class: labelClass,
        for: params.id,
      }),
    ];
  }
}
