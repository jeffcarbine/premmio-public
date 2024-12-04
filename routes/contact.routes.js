import emailValidator from "email-validator";

// Modules
import { renderTemplate } from "../template/renderTemplate.js";
import { sendGmail } from "../modules/sendGmail/sendGmail.js";
import { verifyRecaptcha } from "../modules/verifyRecaptcha/verifyRecaptcha.js";
import { deCamelize } from "../modules/formatString/formatString.js";

// Models
import Message from "../../private/models/Message.js";

// Components
import defaultEmailHtml from "../views/default-email.html.js";
import { Cache } from "../modules/cache/cache.js";

/**
 * Handles the POST request for the contact form.
 *
 * @param {Object} options - The options for handling the contact form.
 * @param {Object} options.req - The request object.
 * @param {Object} options.res - The response object.
 * @param {Array<Object>} options.reasons - The object of reasons and email addresses associated with them.
 * @param {Array<string>} options.plainText - The list of reasons that should send a plain text email.
 * @param {string} options.recipient - The recipient email address.
 * @param {boolean} [options.includeRecipient=false] - Whether to include the recipient in the email body.
 * @param {string} options.clientName - The name of the client.
 * @param {string} options.url - The URL of the client.
 * @param {string} [options.successMessage="Your message was sent! We will get back to you as soon as we possibly can!"] - The success message to send back to the client.
 */
export const post__contact = ({
  req,
  res,
  reasons,
  plainText,
  recipient,
  includeRecipient = false,
  clientName,
  url,
  successMessage = "Your message was sent! We will get back to you as soon as we possibly can!",
}) => {
  const body = req.body,
    recaptchaReponse = body.recaptchaToken;

  return verifyRecaptcha(recaptchaReponse, (recaptchaValidation) => {
    if (recaptchaValidation.success) {
      // check to see if we have a valid email address
      if (!body.email || !emailValidator.validate(body.email)) {
        return res
          .status(403)
          .send(
            "Sorry, your email address appears to be invalid. Please try again."
          );
      }

      const emailBody = {};

      for (let key in body) {
        if (key !== "recaptchaToken" && body[key] !== "") {
          if (key === "reason") {
            emailBody[key] = deCamelize(body[key]);
          } else {
            emailBody[key] = body[key];
          }
        }
      }

      // save it to the database
      Cache.create(Message, { contents: emailBody });

      let emails;

      if (reasons && body.reason && reasons[body.reason]) {
        emails = reasons[body.reason];

        if (includeRecipient) {
          emails += ", " + recipient;
        }
      } else {
        emails = recipient;
      }

      if (process.env.NODE_ENV === "development") {
        emails = "testemails@carbine.co";
      }

      const html = renderTemplate(
        defaultEmailHtml({
          logo: `${url}/premmio/public/images/email-logo.webp`,
          alt: "Premmio Logo",
          title: `You received a message from the ${clientName} Website:`,
          body: emailBody,
          url,
        })
      );

      const gmailOptions = {
        to: emails,
        from: body.email || "noreply@premm.io",
        subject: `${
          body.name || "Somebody"
        } sent you a message from the ${clientName} Website`,
        res,
        successMessage,
      };

      if (plainText && plainText.includes(body.reason)) {
        gmailOptions.text = body.message;
      } else {
        gmailOptions.html = html;
      }

      if (body.email) {
        gmailOptions.replyTo = body.email;
      }

      if (body.message) {
        gmailOptions.message = body.message;
      }

      return sendGmail(gmailOptions);
    } else {
      return res
        .status(403)
        .send("Sorry, your message was unable to be sent. Please try again.");
    }
  });
};
