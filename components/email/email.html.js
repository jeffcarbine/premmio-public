// Elements
import {
  Html,
  Main,
  Img,
  H1,
  Li,
  Strong,
} from "../../template/elements.html.js";

// Modules
import { deCamelize } from "../../modules/formatString/formatString.js";

/**
 * Generates an email template.
 *
 * @param {string} title - The title of the email.
 * @param {Object} body - The body content of the email.
 * @param {Object} logo - The logo object containing src and alt attributes.
 * @returns {HTML} The generated email template.
 */
export const emailTemplate = (title, body, logo) => {
  /**
   * Creates a list of message items from the body content.
   *
   * @returns {Array<Li>} The list of message items.
   */
  const messageList = () => {
    const list = [];

    for (let key in body) {
      if (key !== "recaptchaToken") {
        const li = new Li({
          style: {
            margin: ".5rem 0",
          },
          children: [new Strong(deCamelize(key) + ": "), body[key]],
        });
        list.push(li);
      }
    }

    return list;
  };

  return new Html({
    head: {
      metas: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { "http-equiv": "X-UA-Compatible", content: "ie=edge" },
      ],
      style: {
        display: "block",
        fontFamily: "system-ui, sans-serif",
      },
    },
    body: [
      new Main({
        style: {
          padding: "1rem",
        },
        child: {
          style: {
            display: "block",
            maxWidth: "30rem",
            margin: "0 auto",
            background: "rgba(0,0,0,.025)",
            padding: "2rem",
            boxShadow: "0 0 5px 0 rgba(0,0,0,.2)",
          },
          children: [
            new Img({
              if: logo !== undefined,
              style: {
                width: "100%",
                maxWidth: "10rem",
                margin: "1rem 0",
              },
              src: logo?.src,
              alt: logo?.alt,
            }),
            new H1({
              style: {
                margin: 0,
              },
              textContent: title,
            }),
            {
              tagName: "ul",
              class: "message",
              children: messageList(),
            },
          ],
        },
      }),
    ],
  });
};
