// Third-Party Imports
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

const listId = process.env.MAILCHIMP_LIST_ID;

/**
 * Adds a subscribing user to the Mailchimp list.
 *
 * @param {string} FNAME - The first name of the user.
 * @param {string} LNAME - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {Array<string>} [tags=[]] - The tags to be added to the user.
 * @param {Function} callback - The callback function to handle the response.
 * @returns {Promise<void>} A promise that resolves when the user is added.
 */
export const addSubscribingUser = async (
  FNAME,
  LNAME,
  email,
  tags = [],
  callback
) => {
  if (email === undefined || email === null) {
    callback("Email is required.");
    return;
  }

  const email_address = email.toLowerCase();

  const response = await mailchimp.lists.setListMember(listId, email_address, {
    email_address,
    status_if_new: "subscribed",
    tags,
    merge_fields: {
      FNAME,
      LNAME,
    },
  });

  // TODO: figure out how to handle errors
  callback();
};
