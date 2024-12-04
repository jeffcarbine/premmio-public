// Modules
import { addSubscribingUser } from "../apis/mailchimp.js";

/**
 * Handles the POST request for email subscription.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const post__emailSubscription = (req, res) => {
  const { firstName, lastName, email, tag } = req.body,
    tags = [tag];

  addSubscribingUser(firstName, lastName, email, tags, (err) => {
    if (err) {
      console.warn(err);
      res
        .status(400)
        .send("There was an error subscribing you. Please try again.");
    } else {
      res.status(200).send("Thank you! You have been subscribed.");
    }
  });
};
