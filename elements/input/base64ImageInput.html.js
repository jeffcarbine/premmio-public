import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import { Img } from "../img/img.html.js";
import { FILE, HiddenInput, Label } from "./input.html.js";

export const BASE64IMAGEInput = ({
  label = "Image",
  base64Image = null,
} = {}) => {
  const id = generateUniqueId();

  return {
    class: "base64ImageInput",
    children: [
      new Img({
        class: "imagePreview",
        src: base64Image,
      }),
      new Label([
        label,
        new FILE({
          name: "imageFile",
          class: "imageFile",
          "data-hiddenInput": id,
        }),
      ]),
      new HiddenInput({
        id,
        name: "base64Image",
        value: base64Image,
      }),
    ],
  };
};
