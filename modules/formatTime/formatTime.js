/**
 * Formats the given time in hours and minutes.
 *
 * @param {number} hours - The hours to format.
 * @param {number} minutes - The minutes to format.
 * @param {boolean} [military=false] - Whether to use military time format.
 * @returns {string} The formatted time string.
 */
export const formatTime = (hours, minutes, military = false) => {
  let formattedHours,
    formattedMinutes,
    suffix = "";

  if (!military) {
    if (hours > 12) {
      formattedHours = hours - 12;
      suffix = " PM";
    } else {
      suffix = " AM";
    }
  } else {
    formattedHours = hours;
  }

  if (minutes < 10) {
    formattedMinutes = "0" + minutes;
  } else {
    formattedMinutes = minutes;
  }

  return formattedHours + ":" + formattedMinutes + suffix;
};

/**
 * Formats a time string in HH:MM format.
 *
 * @param {string} timeString - The time string to format.
 * @returns {string} The formatted time string.
 */
export const formatTimeString = (timeString) => {
  if (!timeString) return "Unknown Time";

  // convert HH:MM string to HHMM number
  const hours = parseInt(timeString.slice(0, 2)),
    minutes = parseInt(timeString.slice(3, 5));

  return formatTime(hours, minutes);
};
