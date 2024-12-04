// Third-Party Imports
import dotenv from "dotenv";
dotenv.config();
import request from "request-promise-native";

// Models
import Token from "../../private/models/Token.js";
import User from "../../private/models/User.js";
import { Cache } from "../modules/cache/cache.js";

const patreonClientId = process.env.PATREON_CLIENT_ID,
  patreonRedirectUri = process.env.PATREON_REDIRECT_URI,
  patreonClientSecret = process.env.PATREON_CLIENT_SECRET,
  patreonOneTimeCode = process.env.PATREON_ONE_TIME_CODE;

export const patreonOauthUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${patreonClientId}&redirect_uri=${patreonRedirectUri}&scope=identity%20identity%5Bemail%5D%20identity.memberships%20campaigns%20campaigns.members%20campaigns.members.address%20campaigns.posts%20campaigns.members%20campaigns.members%5Bemail%5D`;

/**
 * Saves and returns a Patreon token.
 *
 * @param {string} tokenName - The name of the token.
 * @param {string} access_token - The access token.
 * @param {string} refresh_token - The refresh token.
 * @param {number} expires_in - The expiration time in seconds.
 * @returns {Promise<string>} - The saved access token.
 */
const saveAndReturnPatreonToken = async (
  tokenName,
  access_token,
  refresh_token,
  expires_in
) => {
  // create new expiration date
  const now = new Date().getTime(),
    expires = now + expires_in * 1000;

  try {
    const token = await Cache.findOneAndUpdate(
      Token,
      {
        name: tokenName,
      },
      {
        $set: {
          access_token,
          refresh_token,
          expires,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return token.access_token;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Generates a new Patreon token.
 *
 * @param {Object} params - The parameters for generating the token.
 * @param {string} [params.oneTimeCode=patreonOneTimeCode] - The one-time code for generating the token.
 * @param {string} params.tokenName - The name of the token.
 * @returns {Promise<string>} - The generated access token.
 */
export const generateNewPatreonToken = async ({
  oneTimeCode = patreonOneTimeCode,
  tokenName,
} = {}) => {
  console.info("Generating new Patreon token");

  try {
    const body = await request.post({
      url: `https://www.patreon.com/api/oauth2/token?code=${oneTimeCode}&grant_type=authorization_code&client_id=${patreonClientId}&client_secret=${patreonClientSecret}&redirect_uri=${patreonRedirectUri}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    });

    if (body.access_token) {
      console.info("Successfully generated Patreon token");

      if (tokenName) {
        return await saveAndReturnPatreonToken(
          tokenName,
          body.access_token,
          body.refresh_token,
          body.expires_in
        );
      } else {
        // we need to save this token to a user, so we need to get
        // their info from Patreon
        const patreonUser = await request.get({
          url: "https://www.patreon.com/api/oauth2/api/current_user",
          headers: {
            Authorization: `Bearer ${body.access_token}`,
          },
          json: true,
        });

        // loop through the included data and find everything with a
        // type of "pledge" - then, from that data, get the relationships.post.data.id
        // and then find the post in the included data with that id
        // and pull the campaign id from that
        const pledges = patreonUser.included
          .filter((inclusion) => inclusion.type === "pledge")
          .map((pledge) => {
            const postId = pledge.relationships.post.data.id;
            const post = patreonUser.included.find(
              (inclusion) =>
                inclusion.type === "post" && inclusion.id === postId
            );

            return {
              campaign_id: post.relationships.campaign.data.id,
              pledge: pledge.attributes.amount_cents,
            };
          });

        // check to see if we have a user with this patreon id
        // if so, update their token info
        // if not, register a new user
        const user = await User.findOne({
          "patreon.id": patreonUser.data.id,
        });

        if (user) {
          user.patreon.access_token = body.access_token;
          user.patreon.refresh_token = body.refresh_token;
          user.patreon.expires = new Date().getTime() + body.expires_in * 1000;
          user.patreon_pledges = getPledgeData(patreonUser);

          const updatedUser = await user.save();
          return updatedUser;
        } else {
          const username = patreonUser.data.attributes.email,
            password = patreonUser.data.id;

          const newUser = await User.register(
            new User({
              username,
              firstName: patreonUser.data.attributes.first_name,
              createdAt: new Date(),
              status: "active",
              "patreon.id": patreonUser.data.id,
              "patreon.access_token": body.access_token,
              "patreon.refresh_token": body.refresh_token,
              "patreon.expires_in":
                new Date().getTime() + body.expires_in * 1000,
              patreon_pledges: pledges,
            }),
            password
          );

          return newUser;
        }
      }
    } else {
      console.info("Error generating Patreon token:");
      console.error(body);
      throw new Error("Error generating Patreon token");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Retrieves a Patreon token from the database or generates a new one if expired.
 *
 * @param {string} [tokenName="patreon"] - The name of the token.
 * @returns {Promise<string>} - The retrieved Patreon token.
 */
export const getPatreonToken = async (tokenName = "patreon") => {
  try {
    // Step 1: Get token from database
    const token = await Cache.findOne(Token, { name: tokenName });

    if (token === null) {
      // Check to see if we have a one-time code
      if (patreonOneTimeCode) {
        console.info("No Patreon token found, requesting new one");
        return await generateNewPatreonToken({
          oneTimeCode: patreonOneTimeCode,
          tokenName,
        });
      } else {
        if (!patreonClientId || !patreonClientSecret || !patreonRedirectUri) {
          throw new Error(
            "No Patreon client ID, client secret, or redirect URI found. Please correct this in your environment variables."
          );
        } else {
          throw new Error(
            `No Patreon one-time code found in environment variables. Please generate one at ${patreonOauthUrl}`
          );
        }
      }
    } else {
      // Check expiration
      const now = new Date().getTime();

      if (now > token.expires) {
        console.info("Patreon token invalid, requesting new one");
        // Step 2: Refresh token with Patreon
        const body = await request.post({
          url: `https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${token.refresh_token}&client_id=${patreonClientId}&client_secret=${patreonClientSecret}`,
          json: true,
        });

        if (body.error) {
          console.error(body.error);
          throw new Error(body.error);
        } else {
          // Step 3: Update the token in the database
          return await saveAndReturnPatreonToken(
            tokenName,
            body.access_token,
            body.refresh_token,
            body.expires_in
          );
        }
      } else {
        console.info("Patreon token still valid!");
        // Return the valid token
        return token.access_token;
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Refreshes the Patreon pledges for a user.
 *
 * @param {Object} user - The user object.
 * @returns {Promise<Object>} - The updated user object.
 */
export const refreshUserPatreonPledges = async (user) => {
  if (user.clearance > 3) {
    try {
      // Check to see if the user's patreon token is still valid
      const patreon = user.patreon;

      if (patreon.expires < new Date().getTime()) {
        // Refresh the token
        const body = await request.post({
          url: `https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${patreon.refresh_token}&client_id=${patreonClientId}&client_secret=${patreonClientSecret}`,
          json: true,
        });

        if (body.error) {
          throw new Error(body.error);
        }

        const refresh_token = body.refresh_token;
        const expires_in = body.expires_in;

        // Update the user
        user.patreon.refresh_token = refresh_token;
        user.patreon.expires = new Date().getTime() + expires_in * 1000;

        await user.save();
      }

      const access_token = user.patreon.access_token;

      // Get the current user data from Patreon
      const response = await request.get({
        url: "https://www.patreon.com/api/oauth2/api/current_user",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        json: true,
      });

      if (response.errors) {
        throw new Error(response.errors);
      }

      const patreonUser = response;

      // Extract pledges from the response
      const pledges = patreonUser.included
        .filter((inclusion) => inclusion.type === "pledge")
        .map((pledge) => {
          const postId = pledge.relationships.post.data.id;
          const post = patreonUser.included.find(
            (inclusion) => inclusion.type === "post" && inclusion.id === postId
          );

          return {
            campaign_id: post.relationships.campaign.data.id,
            pledge: pledge.attributes.amount_cents,
            last_valid: new Date(),
          };
        });

      // Update user's pledges
      user.patreon_pledges.forEach((userPledge) => {
        const patreonPledge = pledges.find(
          (pledge) => pledge.campaign_id === userPledge.campaign_id
        );

        if (!patreonPledge) {
          if (userPledge.last_valid > new Date().getTime() - 2592000000) {
            pledges.push(userPledge);
          }
        } else {
          if (patreonPledge.pledge < userPledge.pledge) {
            if (userPledge.last_valid > new Date().getTime() - 2592000000) {
              patreonPledge.pledge = userPledge.pledge;
              patreonPledge.last_valid = userPledge.last_valid;
            }
          }
        }
      });

      user.patreon_pledges = pledges;

      const updatedUser = await user.save();
      return updatedUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  } else {
    return user;
  }
};
