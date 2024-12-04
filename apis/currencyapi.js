// Third-Party Imports
import request from "request";

// Models
import ExchangeRate from "../../private/models/ExchangeRate.js";
import { Cache } from "../modules/cache/cache.js";

/**
 * Requests the exchange rate from one currency to another.
 *
 * @param {string} from - The base currency.
 * @param {string} to - The target currency.
 * @param {function} callback - The callback function to handle the exchange rate.
 */
const requestExchangeRate = (from, to, callback) => {
  request.get(
    {
      url: `https://api.currencyapi.com/v3/latest?base_currency=${from}&currencies=${to}&apikey=cur_live_uxcs9SBw9PUsKz3EG7ckxC1ubbGOXPYTlkzjLIuI`,
    },
    (err, res, body) => {
      const json = JSON.parse(body),
        rate = json?.data[`${to}`]?.value;

      // if the rate is undefined, then return the currency we currently have in the database instead
      if (rate === undefined) {
        Cache.findOne(ExchangeRate, {
          from,
          to,
        })
          .then((exchangeRate) => {
            if (exchangeRate === null) {
              console.error("No exchange rate found in the database.");
            } else {
              callback(exchangeRate.rate);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        callback(rate);
      }
    }
  );
};

/**
 * Gets the exchange rate from one currency to another.
 *
 * @param {string} from - The base currency.
 * @param {string} to - The target currency.
 * @param {function} callback - The callback function to handle the exchange rate.
 */
export const getExchangeRate = (from, to, callback) => {
  // check to see if we have the exchange rate in the database
  Cache.findOne(ExchangeRate, {
    from,
    to,
  })
    .then((exchangeRate) => {
      // if there is no exchange rate, get one
      if (exchangeRate === null) {
        requestExchangeRate(from, to, (rate) => {
          // save the exchange rate to the database
          const newExchangeRate = new ExchangeRate({
            from,
            to,
            rate,
            lastUpdated: new Date(),
          });

          newExchangeRate.save((err) => {
            if (err) {
              console.error(err);
            } else {
              callback(rate);
            }
          });
        });
      } else {
        // check to see if the exchange rate is older than 1 month
        const lastUpdated = exchangeRate.lastUpdated,
          now = new Date(),
          oneMonth = 1000 * 60 * 60 * 24 * 30;

        if (now - lastUpdated > oneMonth) {
          // then get a new exchange rate
          requestExchangeRate(from, to, (rate) => {
            // update the exchange rate in the database
            Cache.updateOne(
              ExchangeRate,
              {
                from,
                to,
              },
              {
                $set: {
                  rate,
                  lastUpdated: new Date(),
                },
              },
              (err) => {
                if (err) {
                  console.error(err);
                } else {
                  callback(rate);
                }
              }
            );
          });
        } else {
          // otherwise, just use the exchange rate we already have
          callback(exchangeRate.rate);
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

/**
 * Enables the exchange rate endpoint.
 *
 * @param {Object} app - The Express application instance.
 */
export const enableExchangeRateEndpoint = (app) => {
  app.post("/exchangeRate", (req, res) => {
    const { from, to } = req.body,
      rate = global[`${from}_to_${to}`];

    if (rate) {
      res.status(200).send({ rate });
    } else {
      res.status(404).send({ error: "Rate not found." });
    }
  });
};
