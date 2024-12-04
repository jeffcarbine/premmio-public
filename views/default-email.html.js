// Modules
import { deCamelize } from "../modules/formatString/formatString.js";

// Elements
import {
  H1,
  Img,
  Section,
  Strong,
  Ul,
  P,
  A,
} from "../template/elements.html.js";

/**
 * Renders the default email template.
 *
 * @param {Object} data - The data to pass to the template.
 * @returns {Object} The rendered email template.
 */
export default (data) => {
  const dark900 = "#0d0d14",
    dark800 = "#14141d",
    dark700 = "#222230",
    dark600 = "#323244",
    dark500 = "#444455",
    dark400 = "#565666",
    dark300 = "#696a78",
    dark200 = "#7d7d8a",
    dark100 = "#9998a3",
    midtone = "#a6a6ba",
    light100 = "#afafc1",
    light200 = "#b7b7c8",
    light300 = "#c0c0ce",
    light400 = "#c9c9d5",
    light500 = "#d2d2dc",
    light600 = "#dbdbe3",
    light700 = "#e4e4ea",
    light800 = "#ededf1",
    light900 = "#f6f6f8",
    superlight = "#ffffff";

  const { body, title, logo, alt, url } = data;

  const messageList = () => {
    const list = [];

    for (let key in body) {
      if (key !== "recaptchaToken") {
        const li = {
          children: [new Strong(deCamelize(key) + ": "), body[key]],
        };
        list.push(li);
      }
    }

    return new Ul({
      style: {
        paddingLeft: "1rem",
      },
      children: list,
    });
  };

  return {
    style: {
      background: light800,
      padding: "1rem",
    },
    children: [
      new Section({
        id: "defaultEmail",
        style: {
          margin: "1rem",
          padding: "1rem 3rem",
          borderRadius: "25px",
          background: light700,
        },
        child: {
          children: [
            new Img({
              style: {
                width: "15rem",
                margin: "1rem 0 0 -0.75rem",
              },
              src: logo,
              alt: alt,
            }),
            new H1(title),
            messageList(),
            new P({
              style: {
                fontSize: ".75rem",
                marginTop: "3rem",
                color: dark600,
              },
              children: [
                "A copy of this message was saved to Premmio. You can ",
                new A({
                  href: `${url}/login?redirect=/premmio/messages`,
                  children: "view it at any time",
                }),
                ".",
              ],
            }),
          ],
        },
      }),
    ],
  };
};
