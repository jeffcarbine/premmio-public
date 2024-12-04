import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import { Element } from "../../template/elements.html.js";
import { Field } from "../field/field.html.js";

export class PasswordFields extends Element {
  constructor(params) {
    super(params);

    this["data-component"] = "passwordFields";

    this.children = [
      new Field({
        type: "password",
        id: `password-${generateUniqueId()}`,
        name: "password",
        required: true,
        label: "Password",
      }),
      new Field({
        type: "password",
        id: `passwordConfirm-${generateUniqueId()}`,
        name: "passwordConfirm",
        required: true,
        label: "Confirm Password",
      }),
    ];
  }
}
