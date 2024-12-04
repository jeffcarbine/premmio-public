// Third-Party Imports
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Defines the schema for the episode model.
 *
 * @typedef {Object} EpisodeSchema
 * @property {string} episodeId - The ID of the episode.
 * @property {string} show - The show associated with the episode.
 * @property {Date} pubDate - The publication date of the episode.
 * @property {string} series - The series of the episode.
 * @property {string} title - The title of the episode.
 * @property {string} description - The description of the episode.
 * @property {string} thumbnail - The URL of the episode's thumbnail.
 * @property {string} thumbnailSmall - The URL of the episode's small thumbnail.
 * @property {string} rssLink - The RSS link of the episode.
 * @property {string} appleLink - The Apple Podcasts link of the episode.
 * @property {string} youTubeLink - The YouTube link of the episode.
 * @property {string} spotifyLink - The Spotify link of the episode.
 * @property {string} spotifyUri - The Spotify URI of the episode.
 * @property {string} patreonLink - The Patreon link of the episode.
 * @property {string} patreonVideoLink - The Patreon video link of the episode.
 * @property {boolean} patreonExclusive - Whether the episode is exclusive to Patreon.
 * @property {string} aftershowLink - The link to the aftershow of the episode.
 * @property {string} localPath - The local path of the episode.
 */
const episodeSchema = new Schema({
  episodeId: String,
  show: String,
  pubDate: Date,
  series: String,
  title: String,
  description: String,
  thumbnail: String,
  thumbnailSmall: String,
  rssLink: String,
  appleLink: String,
  youTubeLink: String,
  spotifyLink: String,
  spotifyUri: String,
  patreonLink: String,
  patreonVideoLink: String,
  patreonExclusive: Boolean,
  aftershowLink: String,
  localPath: String,
});

/**
 * Creates the model for episodes and exposes it to the app.
 *
 * @returns {mongoose.Model} The Episode model.
 */
export default mongoose.model("Episode", episodeSchema);
