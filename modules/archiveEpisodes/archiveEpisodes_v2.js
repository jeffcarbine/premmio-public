// Third-Party Imports
import pkg from "rss-to-json";
const { parse } = pkg;
import request from "request-promise-native";

// Models
import Show from "../../../private/models/Show.js";
import Episode from "../../../private/models/Episode.js";

// Modules
import { getSpotifyToken } from "../../apis/spotify.js";
import { organizeYouTubeThumbnails } from "../../apis/youtube.js";
import {
  capitalize,
  urlHyphenate,
} from "../../modules/formatString/formatString.js";
import { getPatreonToken } from "../../apis/patreon.js";
import { Cache } from "../cache/cache.js";
import { extractSeasonEpisode } from "../extractSeasonEpisode/extractSeasonEpisode.js";
import { wordComparison } from "../wordComparison/wordComparison.js";

/**
 * Archives episodes for a given platform and show.
 *
 * @param {string} platform - The platform to archive episodes from.
 * @param {Object} show - The show object containing show details.
 * @param {number} count - The number of episodes to archive.
 * @param {function} seriesIdentifier - Function for identifying series
 * @param {string} rootPlatform - The root platform for the show.
 * @param {function} callback - The callback function to execute after archiving.
 */
const defaultArchiver = async (
  platform,
  show,
  count,
  seriesIdentifier,
  rootPlatform
) => {
  console.info(`Archiving ${capitalize(platform)} episodes for ${show.title}`);

  // set some default variables
  const showToken = show[platform];
  let url;

  // add the count to the url in the appropriate manner for the platform
  switch (platform) {
    case "rss":
      url = showToken;
      break;
    case "patreon":
      url = `https://www.patreon.com/api/oauth2/v2/campaigns/${showToken}/posts?fields%5Bpost%5D=title%2Curl%2Cpublished_at%2Ccontent`;
      break;
    case "spotify":
      url = `https://api.spotify.com/v1/shows/${showToken}/episodes?limit=50`;
      break;
    case "youTube":
      url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${showToken}&key=${process.env.YOUTUBE_API_KEY}`;
      break;
    case "apple":
      url = `https://itunes.apple.com/lookup?id=${showToken}&media=podcast&entity=podcastEpisode&limit=${count}`;
      break;
  }

  if (url) {
    // create an array to store the items
    let items = [];

    const getToken = async () => {
      // depending on the platform, we may need to get a token
      switch (platform) {
        case "patreon":
          const patreonToken = await getPatreonToken();
          await getResults(url, patreonToken);
          break;
        case "spotify":
          const spotifyToken = await getSpotifyToken();
          await getResults(url, spotifyToken);
          break;
        default:
          await getResults(url, null);
          break;
      }
    };

    /**
     * Retrieves results from the specified platform.
     *
     * @param {string} url - The URL to fetch results from.
     * @param {string} token - The authorization token.
     */
    const getResults = async (url, token) => {
      if (platform === "rss") {
        const feed = await parse(url);
        items = feed.items;
        await processResults();
      } else {
        // create the authorization header depending on the platform
        let headers;

        switch (platform) {
          case "patreon":
          case "spotify":
            headers = {
              Authorization: "Bearer " + token,
            };
            break;
        }

        // create the url and headers object
        const urlHeaders = {
          url,
          headers,
          json: true,
        };

        try {
          const results = await request.get(urlHeaders);

          let nextPage;

          // check for pagination for different platforms
          switch (platform) {
            case "patreon":
              nextPage = results.links?.next;
              break;
            case "spotify":
              nextPage = results.next;
              break;
            case "youTube":
              nextPage = results.nextPageToken
                ? `${url}&pageToken=${results.nextPageToken}`
                : null;
              break;
          }

          // shift the result by one for apple
          if (platform === "apple") {
            results.results.shift();
            items = items.concat(results.results);
          } else {
            items = items.concat(results.items);
          }

          // if there is a next page, we need to get that too
          if (nextPage) {
            await getResults(nextPage, token);
          } else {
            await processResults();
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    /**
     * Processes the results by pulling all episodes from the database and fuzzy matching where necessary.
     */
    const processResults = async () => {
      try {
        const episodes = await Episode.find({ show: show._id });

        for (const item of items) {
          if (!item) continue;

          const data = { show: show._id };

          if (platform === rootPlatform) {
            switch (platform) {
              case "rss":
                data.pubDate = new Date(item.published);
                data.localPath = urlHyphenate(item.title);
                data.title = item.title;
                data.episodeId = item.id;
                data.description = item.description;
                break;
              case "patreon":
                data.pubDate = new Date(item.attributes.published_at);
                data.localPath = urlHyphenate(item.attributes.title);
                data.title = item.attributes.title;
                data.episodeId = item.id;
                data.description = item.attributes.content;
                break;
              case "spotify":
                data.pubDate = new Date(item.release_date);
                data.localPath = urlHyphenate(item.name);
                data.title = item.name;
                data.episodeId = item.id;
                data.description = item.description;
                break;
              case "youTube":
                if (item.snippet.title === "Private video") {
                  continue;
                }

                data.pubDate = new Date(item.snippet.publishedAt);
                data.localPath = urlHyphenate(item.snippet.title);
                data.title = item.snippet.title;
                data.episodeId = item.snippet.resourceId.videoId;
                data.description = item.snippet.description;
                break;
              case "apple":
                data.pubDate = new Date(item.releaseDate);
                data.localPath = urlHyphenate(item.trackName);
                data.title = item.trackName;
                data.episodeId = item.trackId;
                data.description = item.description;
                break;
            }

            const { season, seasonEpisode } = extractSeasonEpisode(data.title);

            if (seriesIdentifier) {
              const series = seriesIdentifier(data.title);

              if (series) {
                data.series = series;
              }
            }

            if (season && seasonEpisode) {
              data.season = season;
              data.seasonEpisode = seasonEpisode;
            }
          }

          switch (platform) {
            case "rss":
              data.rssLink = item.enclosures[0].url;
              data.isPatreonExclusive = false;
              break;
            case "patreon":
              data.patreonLink = item.attributes.url;
              break;
            case "spotify":
              data.spotifyLink = item.external_urls.spotify;
              data.spotifyUri = item.uri;
              data.isPatreonExclusive = false;
              break;
            case "youTube":
              data.youTubeLink = `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`;
              const thumbnails = organizeYouTubeThumbnails(
                item.snippet.thumbnails
              );
              Object.assign(data, thumbnails);
              break;
            case "apple":
              data.appleLink = item.trackViewUrl;
              data.isPatreonExclusive = false;
              break;
          }

          if (platform === rootPlatform) {
            await Cache.findOneAndUpdate(
              Episode,
              { episodeId: data.episodeId },
              { $set: data },
              { upsert: true }
            );
          } else {
            let bestMatch = null;
            let bestMatchScore = 0;

            for (const episode of episodes) {
              let title;

              switch (platform) {
                case "rss":
                  title = item.title;
                  break;
                case "patreon":
                  title = item.attributes.title;
                  break;
                case "spotify":
                  title = item.name;
                  break;
                case "youTube":
                  title = item.snippet.title;
                  break;
                case "apple":
                  title = item.trackName;
                  break;
              }

              const score = wordComparison(title, episode.title, [show.title]);

              if (score > bestMatchScore) {
                bestMatch = episode;
                bestMatchScore = score;
              }
            }

            if (bestMatch && bestMatchScore > 70) {
              await Cache.findOneAndUpdate(
                Episode,
                { _id: bestMatch._id },
                { $set: data }
              );
            }
          }
        }

        console.info(`Successfully updated ${capitalize(platform)} episodes`);
      } catch (err) {
        console.error(err);
      }
    };

    await getToken();
  } else {
    console.warn(`No ${platform} URL for ${show.title}`);
  }
};

/**
 * Archives episodes for all shows using the specified archivers.
 *
 * @param {Object} options - The options for archiving episodes.
 * @param {number} [options.count=1] - The number of episodes to archive.
 * @param {string} [options.rootPlatform="rss"] - The root platform for archiving.
 * @param {function} [options.rssArchiver=defaultArchiver] - The archiver function for RSS.
 * @param {function} [options.patreonArchiver=defaultArchiver] - The archiver function for Patreon.
 * @param {function} [options.spotifyArchiver=defaultArchiver] - The archiver function for Spotify.
 * @param {function} [options.youTubeArchiver=defaultArchiver] - The archiver function for YouTube.
 * @param {function} [options.appleArchiver=defaultArchiver] - The archiver function for Apple.
 */
export const archiveEpisodes = async ({
  count = 1,
  rootPlatform = "rss",
  platformPriority = ["rss", "spotify", "youTube", "apple", "patreon"],
  rssArchiver = defaultArchiver,
  patreonArchiver = defaultArchiver,
  spotifyArchiver = defaultArchiver,
  youTubeArchiver = defaultArchiver,
  appleArchiver = defaultArchiver,
  seriesIdentifier,
} = {}) => {
  console.info("Starting to archive episodes");

  try {
    const shows = await Show.find();

    for (const show of shows) {
      await archiveShowEpisodes(
        show,
        count,
        rootPlatform,
        platformPriority,
        seriesIdentifier,
        rssArchiver,
        patreonArchiver,
        spotifyArchiver,
        youTubeArchiver,
        appleArchiver
      );
    }
  } catch (err) {
    console.error(err);
  }
};

/**
 * Archives episodes for a specific show using the specified archivers.
 *
 * @param {Object} show - The show object containing show details.
 * @param {number} count - The number of episodes to archive.
 * @param {string} rootPlatform - The root platform for archiving.
 * @param {Array} platformPriority - The priority order of platforms.
 * @param {function} rssArchiver - The archiver function for RSS.
 * @param {function} patreonArchiver - The archiver function for Patreon.
 * @param {function} spotifyArchiver - The archiver function for Spotify.
 * @param {function} youTubeArchiver - The archiver function for YouTube.
 * @param {function} appleArchiver - The archiver function for Apple.
 */
const archiveShowEpisodes = async (
  show,
  count,
  rootPlatform,
  platformPriority,
  seriesIdentifier,
  rssArchiver,
  patreonArchiver,
  spotifyArchiver,
  youTubeArchiver,
  appleArchiver
) => {
  const archivers = {
    rss: rssArchiver,
    spotify: spotifyArchiver,
    apple: appleArchiver,
    patreon: patreonArchiver,
    youTube: youTubeArchiver,
  };

  // Check if rootPlatform is available on the show
  if (!show[rootPlatform]) {
    // Find the first available platform in the order of priority
    rootPlatform =
      platformPriority.find((platform) => show[platform] !== "") ||
      rootPlatform;
  }

  const availablePlatforms = Object.keys(archivers).filter(
    (platform) => show[platform] !== ""
  );

  // Ensure rootPlatform is first in the list if it exists
  if (availablePlatforms.includes(rootPlatform)) {
    availablePlatforms.splice(availablePlatforms.indexOf(rootPlatform), 1);
    availablePlatforms.unshift(rootPlatform);
  }

  for (const platform of availablePlatforms) {
    try {
      await archivers[platform](
        platform,
        show,
        count,
        seriesIdentifier,
        rootPlatform,
        () => {}
      );
    } catch (err) {
      console.error(err);
    }
  }

  console.info("Successfully updated episodes for " + show.title);
};
