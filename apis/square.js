// Standard Library Imports
const request = require("request");

// Third-Party Imports
const emailValidator = require("email-validator");

/**
 * Get Or Create Customer
 * @param {string} email - The email of the customer.
 * @param {string} firstName - The first name of the customer.
 * @param {string} lastName - The last name of the customer.
 * @returns {void} The customer ID from Square.
 */
const getOrCreateCustomer = (email, firstName, lastName) => {
  console.info("Getting customer data from Square");
  console.info(email);
  let isValidEmail = emailValidator.validate(email);
  if (!isValidEmail) {
    console.info(
      email +
        " is not a valid email address. Generating placeholder email address."
    );
    // make up a temp email
    let newEmail = Date.now() + "@tailorcooperative-tempemail.com";
    console.info(newEmail);
    email = newEmail;
  }

  // check Square for customer matching email
  request.post(
    {
      url: squareUrl + "/v2/customers/search",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + square_access_token,
      },
      body: JSON.stringify({
        query: {
          filter: {
            email_address: {
              exact: email,
            },
          },
        },
      }),
    },
    (err, httpResponse, str) => {
      if (err) {
        callback(err);
      } else {
        let body = JSON.parse(str);

        // display the response
        console.info(body);

        // if there is no matching customer found
        if (body.customers === undefined) {
          // create a customer
          request.post(
            {
              url: squareUrl + "/v2/customers",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + square_access_token,
              },
              body: JSON.stringify({
                given_name: firstName,
                family_name: lastName,
                email_address: email,
                phone_number: phone,
                address: {
                  address_line_1: address,
                  locality: city,
                  administrative_district_level_1: state,
                  postal_code: zip,
                  country: country,
                },
              }),
            },
            (err, httpResponse, str) => {
              if (err) {
                callback(err);
              } else {
                let body = JSON.parse(str);

                // get their square id
                let squareCustomerId = body.customer.id,
                  squareNew = true;

                console.info(
                  "Got newly created customer ID from Square: " +
                    squareCustomerId
                );
                callback(null, squareCustomerId, squareNew);
              }
            }
          );
        } else {
          // customer exists
          let squareCustomerId = body.customers[0].id,
            squareNew = false;

          // update customer's info
          request.put(
            {
              url: squareUrl + "/v2/customers/" + squareCustomerId,
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + square_access_token,
              },
              body: JSON.stringify({
                given_name: firstName,
                family_name: lastName,
                email_address: email,
                phone_number: phone,
                address: {
                  address_line_1: address,
                  locality: city,
                  administrative_district_level_1: state,
                  postal_code: zip,
                  country: country,
                },
              }),
            },
            (err, httpResponse, str) => {
              if (err) {
                callback(err);
              } else {
                let body = JSON.parse(str);

                console.info(
                  "Got existing customer ID from Square: " + squareCustomerId
                );

                // set a timeout here to see if we just need to give request some breathing room??
                setTimeout(() => {
                  callback(null, squareCustomerId, squareNew);
                }, 1000);
              }
            }
          );
        }
      }
    }
  );
};

/**
 * Create Payment
 * @returns {void}
 */
const createPayment = () => {
  request.post(
    {
      url: squareUrl + "/v2/payments",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + square_access_token,
      },
      body: JSON.stringify({
        idempotency_key,
        amount_money: {
          amount: cardPrice,
          currency: "USD",
        },
        order_id: squareOrderId,
        source_id: sourceId,
        autocomplete: true,
        customer_id: purchaserIds.squareCustomerId,
        location_id: square_slc_location_id,
      }),
    },
    (err, httpResponse, str) => {
      if (err) {
        callback(err);
      } else {
        let body = JSON.parse(str);
        console.info("payment creation response from Square:");
        console.info(body);

        if (body.errors !== undefined) {
          callback(body.errors);
        } else {
          callback(
            null,
            purchaserIds,
            recipientIds,
            gans,
            parts,
            cardValue,
            cardPrice,
            squareOrderId
          );
        }
      }
    }
  );
};
