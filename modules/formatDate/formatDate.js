// Modules
import { months } from "../months/months.js";

/**
 * Formats a date object into a "Month Day, Year" format (e.g., January 5th, 2024).
 *
 * @param {Date|string} date - The date object or date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date) => {
  if (typeof date === "string" || typeof date === "number")
    date = new Date(date);

  // get the day, month and year values from the date object
  const day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();

  // create the date string
  return createDateString(day, month, year);
};

/**
 * Creates a date string in the "Month Day, Year" format.
 *
 * @param {number} day - The day of the month.
 * @param {number} month - The month of the year.
 * @param {number} year - The year.
 * @returns {string} The formatted date string.
 */
export const createDateString = (day, month, year) => {
  const dayMonth = formatDayMonth(day, month);

  // add it together
  return dayMonth + " " + year;
};

/**
 * Formats the day and month into a "Month Day" format with the correct suffix for the day.
 *
 * @param {number} day - The day of the month.
 * @param {number} month - The month of the year.
 * @returns {string} The formatted day and month string.
 */
export const formatDayMonth = (day, month) => {
  // get the day of the month
  const dayNumber = parseInt(day),
    // get the name of the month from the months array
    monthName = months[parseInt(month) - 1];

  // default suffix is th
  let suffix = "th";

  // switch through the other options
  switch (dayNumber) {
    case 1:
    case 21:
    case 31:
      suffix = "st";
      break;
    case 2:
    case 22:
      suffix = "nd";
      break;
    case 3:
    case 23:
      suffix = "rd";
      break;
  }

  // add it together
  return monthName + " " + dayNumber + suffix;
};

/**
 * Formats a simple date (YYYYMMDD) into a "Month Day, Year" format.
 *
 * @param {number} simpledate - The simple date in YYYYMMDD format.
 * @returns {string} The formatted date string.
 */
export const formatSimpleDate = (simpledate) => {
  // convert YYYYMMDD number to YYYY-MM-DD string
  const year = simpledate.toString().slice(0, 4),
    month = simpledate.toString().slice(4, 6),
    day = simpledate.toString().slice(6, 8);

  return createDateString(day, month, year);
};

export const simpleDateToDate = (simpledate) => {
  const year = simpledate.toString().slice(0, 4),
    month = simpledate.toString().slice(4, 6),
    day = simpledate.toString().slice(6, 8);

  return new Date(year, month - 1, day);
};

export const dateToSimpleDate = (date) => {
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();

  return parseInt(year + "" + month + "" + day);
};

/**
 * Formats a date as "Today", "Yesterday", or "X days ago".
 *
 * @param {Date|string} date - The date object or date string to format.
 * @returns {string} The formatted relative date string.
 */
export const formatDaysAgo = (date) => {
  if (typeof date === "string") date = new Date(date);

  const now = new Date(),
    diff = now - date,
    // get the number of days between the two dates
    // ignoring the time
    days = Math.floor(diff / (1000 * 60 * 60 * 24));

  let daysString = "";

  if (days === 0) {
    daysString = "Today";
  } else if (days === 1) {
    daysString = "Yesterday";
  } else {
    daysString = days + " days ago";
  }

  return daysString;
};

/**
 * Formats a date as either a "Month Day, Year" format or a relative date string.
 *
 * @param {Date|string} date - The date object or date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDateOrDaysAgo = (date) => {
  if (typeof date === "string") date = new Date(date);

  const now = new Date(),
    diff = now - date,
    days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return days < 7 ? formatDaysAgo(date) : formatDate(date);
};
