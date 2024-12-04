/**
 * Formats numbers into currency strings with dollar signs and two decimal places.
 *
 * @param {number} input - The number to format.
 * @param {string} [currency="USD"] - The currency code.
 * @returns {string} The formatted currency string.
 *
 * @example
 * formatCurrency(50); // "$50.00"
 * formatCurrency(10.2); // "$10.20"
 */
export const formatCurrency = (input, currency = "USD") => {
  // uses Intl.NumberFormat and removes any characters before the currency symbol
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  let formatted = formatter.format(input);

  // Remove characters before any currency symbol
  formatted = formatted.replace(
    /.*(?=[\$€£¥₹₽₺₩₪₫₦₲₴₵₸₿฿₡₣₤₥₧₨₩₪₫₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿])/,
    ""
  );

  return formatted;
};

/**
 * Formats cents into dollars with dollar signs and two decimal places.
 *
 * @param {number} [input=0] - The amount in cents to format.
 * @param {string} [currency="USD"] - The currency code.
 * @returns {string} The formatted currency string.
 *
 * @example
 * formatCents(500); // "$5.00"
 * formatCents(10322); // "$103.22"
 */
export const formatCents = (input = 0, currency = "USD") => {
  let i;

  // divide by 100 if we're greater than zero
  if (input > 0) {
    i = input / 100;
  } else {
    // otherwise, you've just got a zero
    i = input;
  }

  // and then just run the regular formatter
  return formatCurrency(i, currency);
};
