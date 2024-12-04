/**
 * Fetches a YouTube playlist and returns the videos.
 *
 * @param {string} playlistId - The ID of the YouTube playlist.
 * @returns {Promise<Array>} The array of fetched videos.
 */
export const fetchYouTubePlaylist = async (playlistId) => {
  let videos = [];

  /**
   * Fetches a page of the YouTube playlist.
   *
   * @param {string|null} [nextPageToken=null] - The token for the next page of the playlist.
   * @returns {Promise<void>}
   */
  const getPlaylistPage = async (nextPageToken = null) => {
    let youtubeUrl =
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" +
      playlistId +
      "&key=" +
      process.env.YOUTUBE_API_KEY;

    if (nextPageToken !== null) {
      youtubeUrl = youtubeUrl + "&pageToken=" + nextPageToken;
    }

    const response = await fetch(youtubeUrl);
    const data = await response.json();
    videos = videos.concat(data.items);

    if (data.nextPageToken) {
      await getPlaylistPage(data.nextPageToken);
    } else {
      // we need to remove all private videos
      videos = videos.filter((obj) => {
        return obj?.snippet.title !== "Private video";
      });
    }
  };

  await getPlaylistPage();
  return videos;
};

/**
 * Fetches YouTube video thumbnails and returns them via a callback.
 *
 * @param {string} videoId - The ID of the YouTube video.
 * @param {Function} callback - The callback function to handle the fetched thumbnails.
 */
export const fetchYouTubeVideoThumbnails = (videoId, callback) => {
  let youtubeUrl =
    "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
    videoId +
    "&key=" +
    process.env.YOUTUBEAPIKEY;

  fetch(youtubeUrl)
    .then((response) => response.json())
    .then((data) => {
      callback(data.items[0].snippet.thumbnails);
    });
};

/**
 * Organizes YouTube thumbnails into a specific format.
 *
 * @param {Object} thumbnails - The thumbnails object from YouTube API.
 * @returns {Object} The organized thumbnails.
 */
export const organizeYouTubeThumbnails = (thumbnails) => {
  let data = {},
    largestThumbnail;

  for (let key in thumbnails) {
    let imageKey;

    // we need to match these to our src, src_lg - src_xs system
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

    data[imageKey] = thumbnails[key].url;

    // store the largest thumbnail for the src
    if (largestThumbnail === undefined) {
      largestThumbnail = key;
    } else if (thumbnails[key].height > thumbnails[largestThumbnail].height) {
      largestThumbnail = key;
    }
  }

  // at the end, if we have a largest thumbnail, we can set the src
  if (largestThumbnail !== undefined) {
    data.src = thumbnails[largestThumbnail].url;
  }

  return data;
};
