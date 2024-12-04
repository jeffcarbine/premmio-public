// Elements
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import { Form } from "../../template/elements.html.js";

// Components
import { Btn } from "../btn/btn.html.js";
import { Field } from "../field/field.html.js";

const PasswordFields = [
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

/**
 * Creates the sign-up component.
 *
 * @returns {Object} The sign-up component configuration.
 */
export const SignUp = () => {
  return {
    id: "signUp",
    "data-component": "user/signUp",
    child: new Form({
      id: "signUpForm",
      action: "/user/signUp",
      children: [
        new Field({
          id: "firstName",
          name: "firstName",
          required: true,
          label: "First Name",
        }),
        new Field({
          id: "lastName",
          name: "lastName",
          required: true,
          label: "Last Name",
        }),
        new Field({
          type: "email",
          id: "username",
          name: "username",
          required: true,
          label: "Email",
        }),
        ...PasswordFields,
        new Btn({
          textContent: "Sign Up",
        }),
      ],
    }),
  };
};
