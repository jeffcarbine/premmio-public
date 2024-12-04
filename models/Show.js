// Third-Party Imports
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Defines the schema for the Show model.
 *
 * @typedef {Object} ShowSchema
 * @property {string} title - The title of the show.
 * @property {boolean} private - Whether the show is private.
 * @property {string} rss - The RSS feed URL of the show.
 * @property {string} patreon - The Patreon URL of the show.
 * @property {string} spotify - The Spotify URL of the show.
 * @property {string} youTube - The YouTube URL of the show.
 * @property {string} apple - The Apple Podcasts URL of the show.
 * @property {Array<Object>} episodes - The array of episodes in the show.
 * @property {string} episodes.id - The ID of the episode.
 * @property {string} episodes.title - The title of the episode.
 */
const showSchema = new Schema({
  title: String,
  private: Boolean,
  rss: String,
  patreon: String,
  spotify: String,
  youTube: String,
  apple: String,
  episodes: [
    {
      id: String,
      title: String,
    },
  ],
});

/**
 * Creates the model for shows and exposes it to the app.
 *
 * @returns {mongoose.Model} The Show model.
 */
export default mongoose.model("Show", showSchema);
