import pkg from "rss-to-json";
const { parse } = pkg;
import request from "request-promise-native";
import { ObjectId } from "mongodb";

import Show from "../../../private/models/Show.js";
import Episode from "../../../private/models/Episode.js";

import { getSpotifyToken } from "../../apis/spotify.js";
import { fetchYouTubePlaylist } from "../../apis/youtube.js";
import {
  hyphenate,
  urlHyphenate,
} from "../../modules/formatString/formatString.js";

import { getPatreonToken } from "../../apis/patreon.js";
import { Cache } from "../cache/cache.js";
import { extractSeasonEpisode } from "../extractSeasonEpisode/extractSeasonEpisode.js";
import { fuzzyMatch } from "../fuzzyMatch/fuzzyMatch.js";
import { wordComparison } from "../wordComparison/wordComparison.js";

const defaultRssArchiver = async (show, count) => {
  console.info("getting episodes from RSS feed");
  const url = show.rss;

  try {
    const feed = await parse(url);
    let episodes = feed.items;
    episodes = episodes.reverse();

    if (episodes.length > count) {
      episodes.length = count;
    }

    for (const episode of episodes) {
      const pubDate = new Date(episode.published),
        localPath = urlHyphenate(episode.title);

      // Extract season and episode information
      const { season, seasonEpisode } = extractSeasonEpisode(episode.title);

      // save to mongodb
      await Cache.findOneAndUpdate(
        Episode,
        {
          title: episode.title,
        },
        {
          episodeId: episode.id,
          show: show._id,
          pubDate,
          title: episode.title,
          season,
          seasonEpisode,
          capitalTitle: episode.title.toUpperCase(),
          description: episode.description,
          rssLink: episode.enclosures[0].url,
          localPath,
          patreonExclusive: false,
        },
        {
          upsert: true,
        }
      );
    }

    console.info("Successfully updated RSS feed episodes");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const defaultPatreonArchiver = async (show, count) => {
  try {
    console.info("trying to get patreon token");
    const patreon_access_token = await getPatreonToken();

    let patreonPosts = [];
    const getPatreonPosts = async (patreonUrl) => {
      const response = await request({
        url: patreonUrl,
        headers: {
          Authorization: "Bearer " + patreon_access_token,
        },
        json: true,
      });

      patreonPosts = patreonPosts.concat(response.data);

      if (response.links && response.links.next) {
        await getPatreonPosts(response.links.next);
      }
    };

    await getPatreonPosts(
      `https://www.patreon.com/api/oauth2/v2/campaigns/${show.patreon}/posts?fields%5Bpost%5D=title%2Curl%2Cpublished_at%2Ccontent`
    );

    for (const post of patreonPosts) {
      const title = post.attributes.title;

      await Cache.findOneAndUpdate(
        Episode,
        {
          title,
        },
        {
          patreonLink: post.attributes.url,
        }
      );
    }

    console.info("Successfully updated Patreon posts");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const defaultSpotifyArchiver = async (show, count) => {
  const fetchSpotifyEps = async (spotify_access_token) => {
    let spotifyEps = [];

    const spotifyUrl = `https://api.spotify.com/v1/shows/${show.spotify}/episodes?limit=50`;

    const getSpotifyEps = async (url) => {
      const response = await request.get({
        url,
        headers: {
          Authorization: "Bearer " + spotify_access_token,
        },
        json: true,
      });

      spotifyEps = spotifyEps.concat(response.items);

      if (response.next) {
        await getSpotifyEps(response.next.replace("/show/", "/shows/"));
      }
    };

    await getSpotifyEps(spotifyUrl);

    spotifyEps = spotifyEps.reverse();

    if (spotifyEps.length > count) {
      spotifyEps.length = count;
    }

    for (const spotifyEp of spotifyEps) {
      const title = spotifyEp.name,
        spotifyLink = spotifyEp.external_urls.spotify,
        spotifyUri = spotifyEp.uri;

      await Cache.findOneAndUpdate(
        Episode,
        {
          title,
        },
        {
          spotifyLink,
          spotifyUri,
        }
      );
    }

    console.info("Successfully updated Spotify episodes");
  };

  try {
    const spotify_access_token = await getSpotifyToken();
    await fetchSpotifyEps(spotify_access_token);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const defaultYouTubeArchiver = async (show, count) => {
  const playlistId = show.youTube;

  const archiveYouTubeVideos = async (videos, episodes) => {
    videos = videos.reverse();
    if (videos.length > count) {
      videos.length = count;
    }

    for (const video of videos) {
      let bestMatch = null,
        bestMatchScore = 0;

      episodes.forEach((episode) => {
        const score = wordComparison(video.snippet.title, episode.title, [
          show.title,
        ]);

        if (score > bestMatchScore) {
          bestMatch = episode;
          bestMatchScore = score;
        }
      });

      if (bestMatchScore > 70) {
        const _id = bestMatch._id;

        const youTubeData = {
          youTubeLink:
            "https://www.youtube.com/watch?v=" +
            video.snippet.resourceId.videoId,
        };

        let largestThumbnail;

        for (let key in video.snippet.thumbnails) {
          let imageKey;

          switch (key) {
            case "standard":
            case "maxres":
              imageKey = "src_lg";
              break;
            case "high":
              imageKey = "src_md";
              break;
            case "medium":
              imageKey = "src_sm";
              break;
            case "default":
              imageKey = "src_xs";
              break;
          }

          youTubeData[imageKey] = video.snippet.thumbnails[key].url;

          if (largestThumbnail === undefined) {
            largestThumbnail = key;
          } else if (
            video.snippet.thumbnails[key].height >
            video.snippet.thumbnails[largestThumbnail].height
          ) {
            largestThumbnail = key;
          }
        }

        youTubeData.src = video.snippet.thumbnails[largestThumbnail].url;

        await Cache.findOneAndUpdate(
          Episode,
          {
            _id: ObjectId(_id),
          },
          youTubeData
        );
      } else {
        console.info(`No match found for ${video.snippet.title}`);
      }
    }

    console.info("Successfully updated YouTube episodes");
  };

  try {
    const episodes = await Episode.find({ show: show._id });
    const videos = await fetchYouTubePlaylist(playlistId);
    await archiveYouTubeVideos(videos, episodes);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const defaultAppleArchiver = async (show, count) => {
  const apple = show.apple;

  const archiveAppleEpisodes = async (episodes) => {
    for (const episode of episodes) {
      const title = episode.trackName,
        appleLink = episode.trackViewUrl;

      await Cache.findOneAndUpdate(
        Episode,
        {
          title,
        },
        {
          appleLink,
        }
      );
    }

    console.info("Successfully updated Apple episodes");
  };

  try {
    const response = await fetch(
      "https:/itunes.apple.com/lookup?id=" +
        apple +
        "&media=podcast&entity=podcastEpisode&limit=" +
        count
    );
    const json = await response.json();
    let episodes = json.results;
    episodes.shift(1);

    await archiveAppleEpisodes(episodes);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const archiveEpisodes = async ({
  count = 1,
  rssArchiver = defaultRssArchiver,
  patreonArchiver = defaultPatreonArchiver,
  spotifyArchiver = defaultSpotifyArchiver,
  youTubeArchiver = defaultYouTubeArchiver,
  appleArchiver = defaultAppleArchiver,
} = {}) => {
  console.info("Starting to archive episodes");

  try {
    const shows = await Show.find();

    for (const show of shows) {
      await archiveLatestEpisode(
        show,
        count,
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

const archiveLatestEpisode = async (
  show,
  count,
  rssArchiver,
  patreonArchiver,
  spotifyArchiver,
  youTubeArchiver,
  appleArchiver
) => {
  try {
    if (show.rss !== "") {
      await rssArchiver(show, count);
    }

    if (show.spotify !== "") {
      await spotifyArchiver(show, count);
    }

    if (show.apple !== "") {
      await appleArchiver(show, count);
    }

    if (show.patreon !== "") {
      await patreonArchiver(show, count);
    }

    if (show.youTube !== "") {
      await youTubeArchiver(show, count);
    }

    console.info("Successfully updated episodes for " + show.title);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
