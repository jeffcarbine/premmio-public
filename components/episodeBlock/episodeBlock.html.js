// Modules
import { smartTruncate } from "../../modules/smartTruncate/smartTruncate.js";
import { removeSeasonEpisode } from "../../modules/removeSeasonEpisode/removeSeasonEpisode.js";
import { formatDate } from "../../modules/formatDate/formatDate.js";
import { cleanUpHTML } from "../../modules/cleanUpHTML/cleanUpHTML.js";

// Local Components
import { EmbeddedSpotifyPlayer } from "../embeddedSpotifyPlayer/embeddedSpotifyPlayer.html.js";
import { EmbeddedYouTubeVideo } from "../embeddedYouTubeVideo/embeddedYouTubeVideo.html.js";

// Components
import { BtnContainer } from "../btn/btn.html.js";
import { Icon } from "../icon/icon.html.js";
import { ResponsiveImg } from "../responsiveImg/responsiveImg.html.js";

// Elements
import { Hgroup, P, A } from "../../template/elements.html.js";

export const EpisodeTitle = ({ episode, summary, delimiter }) => {
  const heading = {
    h: summary ? 2 : 1,
    subheading: formatDate(episode.pubDate),
  };

  let episodeTitle = episode.title,
    episodePreheading;

  if (delimiter) {
    const splitTitle = episode.title.split(delimiter);
    episodePreheading = splitTitle[1];
    episodeTitle = splitTitle[0];
  }

  if (episodePreheading) {
    heading.preheading = episodePreheading;
  }

  if (episode.seasonEpisode && episode.season) {
    heading.preheading = `Season ${episode.season} Episode ${episode.seasonEpisode}`;
    heading.textContent = removeSeasonEpisode(episodeTitle);
  } else {
    heading.textContent = episodeTitle;
  }

  return new Hgroup(heading);
};

export const EpisodeVideo = ({ episode, summary, showImage, imageData }) => {
  const hasImage =
    episode.src ||
    episode.src_lg ||
    episode.src_md ||
    episode.src_sm ||
    episode.src_xs;

  let thumbnailOrVideo;

  if (episode.youTubeLink && !summary) {
    thumbnailOrVideo = EmbeddedYouTubeVideo(episode.youTubeLink);
  } else if (hasImage && showImage) {
    thumbnailOrVideo = new ResponsiveImg({
      class: "thumbnail",
      ...imageData,
    });
  }

  return {
    if: hasImage,
    class: "thumbnailContainer",
    child: thumbnailOrVideo,
  };
};

export const EpisodeSpotify = ({ episode, summary }) => {
  return {
    if: !summary && episode.spotifyUri,
    id: "spotifyPlayer",
    child: new EmbeddedSpotifyPlayer(episode.spotifyUri),
  };
};

export const EpisodeDescription = ({ episode, summary, descriptionLimit }) => {
  let description = {
    class: "description",
  };

  if (episode.description.includes("<")) {
    description.innerHTML = summary
      ? smartTruncate(episode.description, descriptionLimit)
      : cleanUpHTML(episode.description);
  } else {
    description.child = new P(
      summary
        ? smartTruncate(episode.description, descriptionLimit)
        : episode.description
    );
  }

  return description;
};

export const EpisodeNavigation = ({ summary, prevEpisode, nextEpisode }) => {
  const episodeNavigation = {
    if: !summary && (nextEpisode || prevEpisode),
    class: "episodeNavigation",
    children: [],
  };

  if (prevEpisode) {
    episodeNavigation.children.push(
      new A({
        if: prevEpisode,
        class: "previousEpisode",
        href: `/episode/${prevEpisode.localPath}`,
        children: [
          new Icon("arrowLeft"),
          `Previous: ${removeSeasonEpisode(prevEpisode?.title)}`,
        ],
      })
    );
  }

  if (nextEpisode) {
    episodeNavigation.children.push(
      new A({
        if: nextEpisode,
        class: "nextEpisode",
        href: `/episode/${nextEpisode.localPath}`,
        children: [
          `Next: ${removeSeasonEpisode(nextEpisode?.title)}`,
          new Icon("arrowRight"),
        ],
      })
    );
  }

  return episodeNavigation;
};

/**
 * Generates the episode block layout.
 *
 * @param {Object} params - The parameters for the episode block.
 * @param {Object} params.episode - The episode data.
 * @param {boolean} [params.summary=false] - Whether this is a summary episode block or a full page episode block.
 * @param {Object} [params.prevEpisode] - The previous episode data.
 * @param {Object} [params.nextEpisode] - The next episode data.
 * @param {boolean} [params.showImage=true] - Whether to show the image or not.
 * @param {string} [params.cta="View Episode"] - The call to action text.
 * @returns {HTMLElement} The episode block element.
 */
export const EpisodeBlock = ({
  use = {
    navigation: true,
    title: true,
    spotify: true,
    video: true,
    description: true,
  },
  episode,
  summary = false,
  descriptionLimit = 1000,
  delimiter,
  showImage = true,
  cta = "View Episode",
  prevEpisode,
  nextEpisode,
}) => {
  const imageData = {};
  const imageKeys = ["src", "src_lg", "src_md", "src_sm", "src_xs"];

  imageKeys.forEach((key) => {
    if (episode[key]) {
      imageData[key] = episode[key];
    }
  });

  const block = {
    class: `episodeBlock ${summary ? "summary" : "page"}`,
    children: [
      use.navigation &&
        EpisodeNavigation({ summary, prevEpisode, nextEpisode }),
      use.video && EpisodeVideo({ episode, summary, showImage, imageData }),
      {
        class: "contentContainer",
        children: [
          use.title && EpisodeTitle({ episode, summary, delimiter }),
          use.spotify && EpisodeSpotify({ episode, summary }),
          use.description &&
            EpisodeDescription({ episode, summary, descriptionLimit }),
          summary &&
            new BtnContainer({
              href: `/episode/${episode.localPath}`,
              textContent: cta,
            }),
          !summary &&
            new BtnContainer(
              [
                episode.spotifyLink && {
                  children: [new Icon("spotify"), "Listen on Spotify"],
                  href: episode.spotifyLink,
                },
                episode.youTubeLink && {
                  children: [new Icon("youTube"), "Watch on YouTube"],
                  href: episode.youTubeLink,
                },
                episode.applePodcastsLink && {
                  children: [
                    new Icon("applePodcasts"),
                    "Listen on Apple Podcasts",
                  ],
                  href: episode.applePodcastsLink,
                },
              ].filter(Boolean) // Filter out false values
            ),
        ].filter(Boolean), // Filter out false values
      },
    ].filter(Boolean), // Filter out false values
  };

  if (episode.seasonEpisode && episode.season) {
    block["data-season"] = episode.season;
    block["data-episode"] = episode.seasonEpisode;
  }

  return block;
};
