/**
 * Calculates the date range for a given number of weeks ago.
 *
 * @param {number} [weeksAgo=0] - The number of weeks ago to calculate the range for.
 * @param {Date} [now=new Date()] - The current date.
 * @returns {Object} An object containing the start and end dates of the week range.
 */
export default (weeksAgo = 0, now = new Date()) => {
  const week_comparison = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - weeksAgo * 7
  );

  let start_date = new Date(),
    end_date = new Date();

  start_date.setDate(week_comparison.getDate() - week_comparison.getDay());
  start_date.setUTCHours(0, 0, 0, 0);
  end_date.setDate(begin_time.getDate() + 7);
  end_date.setUTCHours(23, 59, 59, 999);

  return {
    begin_date,
    end_date,
  };
};
