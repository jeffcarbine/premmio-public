// Components
import { BtnContainer } from "../btn/btn.html.js";
import { Field } from "../field/field.html.js";

// Elements
import { Form } from "../../template/elements.html.js";

export const LogIn = (buttonClass = "") => {
  return {
    id: "logIn",
    "data-component": "user/logIn",
    child: new Form({
      id: "logInForm",
      action: "/premmio/login",
      children: [
        new Field({
          type: "email",
          id: "email",
          name: "username",
          required: true,
          label: "Email",
        }),
        new Field({
          type: "password",
          id: "password",
          name: "password",
          required: true,
          label: "Password",
        }),
        {
          class: "login-action",
          child: new BtnContainer(
            {
              class: buttonClass,
              textContent: "Log In",
            },
            "centered"
          ),
        },
      ],
    }),
  };
};
