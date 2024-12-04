/** Date Ranges
 *  These functions allow you to simply create date ranges represented by
 *  two Date objects in an array
 *
 *  [start_date, end_date]
 */

/**
 * Gives you a date range of today and a second date
 * as far into the future as you want, controlled by
 * setting the year, month and day modification you want
 * -- numbers can be positive or negative!
 *
 * @param {number} [year=0] - The number of years to offset.
 * @param {number} [month=0] - The number of months to offset.
 * @param {number} [day=0] - The number of days to offset.
 * @returns {Date[]} An array containing the start date and end date.
 */
export const offsetDate = (year = 0, month = 0, day = 0) => {
  // get today
  let first_date = new Date();
  // set the time to midnight
  first_date.setHours(0, 0, 0, 0);

  // get the year, month and day of first_date
  const first_year = first_date.getFullYear(),
    first_month = first_date.getMonth(),
    first_day = first_date.getDate();

  // get the end date
  let second_date = new Date();
  // set the time to midnight
  second_date.setHours(0, 0, 0, 0);

  // add the values you want to the second date
  second_date.setFullYear(first_year + year);
  second_date.setMonth(first_month + month);
  second_date.setDate(first_day + day);

  // make sure the smaller of the two days goes first
  if (first_date > second_date) {
    return [second_date, first_date];
  } else {
    return [first_date, second_date];
  }
};

/** Month-to-Date
 * Gets you a range from the start of the month to the
 * date you want, defaulting to today
 *
 * @param {Date} [start_date=new Date()] - The start date, defaulting to today.
 * @returns {Date[]} An array containing the start date and end date.
 */
export const monthToDate = (start_date = new Date()) => {
  // create the Date object for the start of the month
  let startOfMonth = new Date(start_date);
  // set the date of that Date to 1
  startOfMonth.setDate(1);

  return [startOfMonth, start_date];
};

/** Full Month
 * Gets you a date range for the entire month a date is in,
 * defaulting to today
 *
 * @param {Date} [start_date=new Date()] - The start date, defaulting to today.
 * @returns {Date[]} An array containing the start date and end date.
 */
export const fullMonth = (start_date = new Date()) => {
  // create date objects based off of the supplied date
  let startOfMonth = new Date(start_date),
    endOfMonth = new Date(start_date);

  // get the current month
  const month = start_date.getMonth();

  // start of month gets set to 1
  startOfMonth.setDate(1);

  // end of month gets set to next month
  endOfMonth.setMonth(month + 1);
  // and the day gets set to zero, flipping
  // the calendar back one day back to the end
  // of the previous month
  endOfMonth.setDate(0);

  return [startOfMonth, endOfMonth];
};

/**
 * Week Range
 * Calculates the start and end dates of a week range based on an offset from the current date.
 *
 * @param {number} [offsetWeeks=0] - The number of weeks to offset from the current date.
 * @param {Date} [date=new Date()] - The reference date.
 * @returns {Object} An object containing the start and end dates of the week range.
 * @returns {Date} returns.start_date - The start date of the week range.
 * @returns {Date} returns.end_date - The end date of the week range.
 */
export const weekRange = (offsetWeeks = 0, date = new Date()) => {
  const week_comparison = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + offsetWeeks * 7
  );

  let start_date = new Date(),
    end_date = new Date();

  start_date.setDate(week_comparison.getDate() - week_comparison.getDay());
  start_date.setHours(0, 0, 0, 0);
  end_date.setDate(start_date.getDate() + 7);
  end_date.setHours(23, 59, 59, 999);

  return {
    start_date,
    end_date,
  };
};

/**
 * Calculates the number of months between two dates.
 *
 * @param {Date} d1 - The start date.
 * @param {Date} d2 - The end date.
 * @returns {number} The number of months between the two dates.
 */
export const numberOfMonths = (d1, d2) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};
