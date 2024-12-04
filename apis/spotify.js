import dotenv from "dotenv";
dotenv.config();

// Standard Library Imports
import { Buffer } from "buffer";

// Third-Party Imports
import request from "request-promise-native";

// Models
import Token from "../../private/models/Token.js";
import { Cache } from "../modules/cache/cache.js";

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID,
  spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET,
  spotify_access_code = process.env.SPOTIFY_ACCESS_CODE;

/**
 * Generates a Spotify token and saves it to the database.
 * use this url to generate the access_token
 * https://accounts.spotify.com/en/authorize?response_type=code&client_id=<CLIENTID>&redirect_uri=https://carbine.co
 *
 * @returns {Promise<string>} The generated Spotify token.
 */
const generateSpotifyToken = async () => {
  try {
    const response = await request.post({
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
            "base64"
          ),
      },
      form: {
        code: spotify_access_code,
        redirect_uri: "https://carbine.co",
        grant_type: "authorization_code",
      },
      json: true,
    });

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    if (response.access_token) {
      const token = await Cache.findOneAndUpdate(
        Token,
        {
          name: "spotify",
        },
        {
          $set: {
            name: "spotify",
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            expires,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.info("Successfully generated Token for Spotify");
      return token.access_token;
    } else {
      console.error("No access token received from Spotify");
      return null;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Retrieves a Spotify token from the database or generates a new one if expired.
 *
 * @returns {Promise<string>} The retrieved Spotify token.
 */
export async function getSpotifyToken() {
  const now = new Date().getTime();

  try {
    // First, attempt to get the token from the database
    const token = await Token.findOne({ name: "spotify" });

    // If the token is still valid, use it
    if (token !== null && token.expires > now) {
      console.info("Spotify token is still valid");
      return token.access_token;
    } else {
      // If the token is null, we don't have one so we need to generate a token
      if (token === null) {
        console.info("No Spotify token found - generating new token");
        return await generateSpotifyToken();
      } else {
        console.info("Spotify token has expired - refreshing token");
        // Otherwise, let's get a new token
        return await refreshSpotifyToken(token);
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Refreshes a Spotify token using the refresh token.
 *
 * @param {Object} token - The token object containing the refresh token.
 * @returns {Promise<string>} The refreshed Spotify token.
 */
const refreshSpotifyToken = async (token) => {
  const refresh_token = token.refresh_token;

  try {
    const response = await request.post({
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
            "base64"
          ),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token,
      },
      json: true,
    });

    token.access_token = response.access_token;
    // Expires after 30 minutes
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 30);
    token.expires = expires;
    await token.save();

    return response.access_token;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
