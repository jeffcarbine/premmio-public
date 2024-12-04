// Third-Party Imports
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Defines the schema for the event model.
 *
 * @typedef {Object} EventSchema
 * @property {string} venue - The venue of the event.
 * @property {string} title - The title of the event.
 * @property {string} street - The street address of the event.
 * @property {string} city - The city where the event is held.
 * @property {string} region - The region where the event is held.
 * @property {string} country - The country where the event is held.
 * @property {string} latitude - The latitude of the event location.
 * @property {string} longitude - The longitude of the event location.
 * @property {string} festival - The festival associated with the event.
 * @property {number} date - The date of the event in simpledate format.
 * @property {string} time - The time of the event.
 * @property {number} price - The price of the event.
 * @property {string} tickets - The URL for purchasing tickets.
 * @property {string} ticketId - The ID of the ticket.
 * @property {boolean} soldOut - Whether the event is sold out.
 * @property {number} publishDate - The publish date of the event in simpledate format.
 */
const eventSchema = new Schema({
  venue: String,
  title: String,
  street: String,
  city: String,
  region: String,
  country: String,
  latitude: String,
  longitude: String,
  festival: String,
  date: {
    // simpledate
    type: Number,
    min: 10000000,
    max: 99999999,
  },
  time: String,
  price: Number,
  tickets: String,
  ticketId: String,
  soldOut: Boolean,
  publishDate: {
    // simpledate
    type: Number,
    min: 10000000,
    max: 99999999,
  },
});

/**
 * Creates the model for events and exposes it to the app.
 *
 * @returns {mongoose.Model} The Event model.
 */
export default mongoose.model("Event", eventSchema);
