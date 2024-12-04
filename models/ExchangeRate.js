// Third-Party Imports
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Defines the schema for the exchange rate model.
 *
 * @typedef {Object} ExchangeRateSchema
 * @property {string} to - The target currency code.
 * @property {string} from - The source currency code.
 * @property {number} rate - The exchange rate.
 * @property {Date} lastUpdated - The date when the exchange rate was last updated.
 */
const exchangeRateSchema = new Schema({
  to: String,
  from: String,
  rate: Number,
  lastUpdated: Date,
});

/**
 * Creates the model for exchange rates and exposes it to the app.
 *
 * @returns {mongoose.Model} The ExchangeRate model.
 */
export default mongoose.model("ExchangeRate", exchangeRateSchema);
