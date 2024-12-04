// Third-Party Imports
import request from "request";

const secret = process.env.RECAPTCHA_SECRET;

/**
 * Verifies the reCAPTCHA response with Google.
 *
 * @param {string} response - The reCAPTCHA response token.
 * @param {function} callback - The callback function to handle the verification result.
 */
export const verifyRecaptcha = (response, callback) => {
  // send recaptchaResponse to Google
  request.post(
    {
      url:
        "https://www.google.com/recaptcha/api/siteverify?secret=" +
        secret +
        "&response=" +
        response,
    },
    (err, httpResponse, str) => {
      if (err) {
        console.error(err);
      } else {
        const body = JSON.parse(str);

        callback(body);
      }
    }
  );
};
