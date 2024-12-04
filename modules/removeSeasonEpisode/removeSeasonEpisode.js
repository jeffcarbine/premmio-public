export const removeSeasonEpisode = (str) => {
  // Regular expression to match season and episode patterns
  const regex = /\b[S|C](\d+)[\s|\.]?E[P|p]?\.?(\d+)\b/g;

  // Remove the matched patterns
  let cleanedStr = str.replace(regex, "").trim();

  // Remove non-alphanumeric characters from the start of the string
  cleanedStr = cleanedStr.replace(/^[^a-zA-Z0-9]+/, "");

  return cleanedStr;
};
