// Third-Party Imports
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends an email using Gmail's SMTP server.
 *
 * @param {Object} options - The options for sending the email.
 * @param {string} [options.to=process.env.EMAIL_ADDRESS] - The recipient email address.
 * @param {string} [options.subject="You received a message"] - The subject of the email.
 * @param {string} [options.message="Somebody has sent you a message from your website"] - The plain text message body.
 * @param {Object} [options.res=false] - The response object to send a success message to.
 * @param {string} [options.successMessage="Email sent successfully"] - The success message to send in the response.
 * @param {string} [options.replyTo=null] - The email address to reply to.
 * @param {string} [options.html] - The HTML message body.
 */
export const sendGmail = ({
  to = process.env.EMAIL_ADDRESS,
  subject = "You received a message",
  message = "Somebody has sent you a message from your website",
  res = false,
  successMessage = "Email sent successfully",
  replyTo = null,
  html,
}) => {
  // create the emailData object
  const emailData = {
    from: process.env.EMAIL_ADDRESS,
    to, // recipient
    subject: subject, // Subject line
    text: message, // plain text body
    html,
  };

  if (replyTo !== null) {
    emailData.replyTo = replyTo;
  }

  // send the email
  transporter
    .sendMail(emailData)
    .then(() => {
      // and return a 200 if response was provided
      if (res) {
        return res.status(200).send(successMessage);
      }
    })
    .catch((err) => {
      return res.status(503).send(err);
    });
};
