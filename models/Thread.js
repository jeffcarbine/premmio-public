// Third-Party Imports
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Defines the schema for the Thread model.
 *
 * @typedef {Object} ThreadSchema
 * @property {string} userId - The ID of the user.
 * @property {Date} created - The creation date of the thread.
 * @property {Array<Object>} messages - The array of messages in the thread.
 * @property {string} messages.to - The recipient of the message.
 * @property {string} messages.messageType - The type of the message.
 * @property {string} messages.body - The body of the message.
 * @property {Date} messages.timestamp - The timestamp of the message.
 */
const threadSchema = new Schema({
  userId: String,
  created: Date,
  messages: [
    {
      to: String,
      messageType: String,
      body: String,
      timestamp: Date,
    },
  ],
});

/**
 * Creates the model for threads and exposes it to the app.
 *
 * @returns {mongoose.Model} The Thread model.
 */
export default mongoose.model("Thread", threadSchema);
