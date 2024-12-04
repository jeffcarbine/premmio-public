// Elements
import { Iframe } from "../../template/elements.html.js";

/**
 * Creates an embedded YouTube video component.
 *
 * @param {string} url - The URL of the YouTube video.
 * @returns {Object} The configuration object for the embedded YouTube video.
 */
export const EmbeddedYouTubeVideo = (url) => {
  // if the url is a watch url, convert it to an embed url
  if (url.includes("watch?v=")) {
    url = url.replace("watch?v=", "embed/");
  }

  return {
    class: "embeddedYouTubeVideo",
    child: new Iframe({
      src: url,
      width: "560", // You can adjust the width
      height: "315", // You can adjust the height
      frameBorder: "0",
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullscreen: true,
    }),
  };
};
