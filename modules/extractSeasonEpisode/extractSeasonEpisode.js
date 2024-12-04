/**
 * Extracts the season and episode numbers from a title string.
 *
 * @param {string} title - The title string to extract season and episode numbers from.
 * @returns {Object} An object containing the season and episode numbers.
 * @returns {number|null} returns.season - The extracted season number, or null if not found.
 * @returns {number|null} returns.seasonEpisode - The extracted episode number, or null if not found.
 */

export const extractSeasonEpisode = (title) => {
  const patterns = [
    /[SC](\d{1,2})E(\d{1,2})/i, // S##E## or C##E##
    /[SC](\d{1,2}) E(\d{1,2})/i, // S## E## or C## E##
    /[SC](\d{1,2}) EP(\d{1,2})/i, // S## EP## or C## EP##
    /[SC](\d{1,2}) Ep\. (\d{1,2})/i, // S## Ep. ## or C## Ep. ##
    /(\d{1,2})x(\d{1,2})/i, // ##x##
    /(\d{1,2})\.(\d{1,2})/i, // ##.##
    /Season (\d{1,2}), Episode (\d{1,2})/i, // Season ##, Episode ##
    /Season (\d{1,2}) Episode (\d{1,2})/i, // Season ## Episode ##
    /Campaign (\d{1,2}), Episode (\d{1,2})/i, // Campaign ##, Episode ##
    /Campaign (\d{1,2}) Episode (\d{1,2})/i, // Campaign ## Episode ##
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return {
        season: parseInt(match[1], 10),
        seasonEpisode: parseInt(match[2], 10),
      };
    }
  }

  return {
    season: null,
    seasonEpisode: null,
  };
};
