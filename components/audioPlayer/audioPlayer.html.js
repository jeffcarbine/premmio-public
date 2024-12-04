// Elements
import { Icon } from "../../components/icon/icon.html.js";

/**
 * Creates an audio player component.
 *
 * @param {string} link - The link to the audio source.
 * @param {string} [title=""] - The title of the audio.
 * @param {boolean} [ifValue=true] - The condition to render the component.
 * @returns {Object} The audio player component configuration.
 */
export const AudioPlayer = (link, title = "", ifValue = true) => {
  return {
    if: ifValue,
    "data-component": "audioPlayer",
    class: "audioPlayer",
    children: [
      {
        tagName: "audio",
        controls: true,
        "data-src": link,
      },
      {
        class: "controls",
        children: [
          {
            class: "name",
            textContent: title,
          },
          {
            class: "play-container",
            child: {
              class: "toggle-play play",
            },
          },
          {
            class: "time",
            children: [
              {
                class: "current",
                textContent: "--:--",
              },
              {
                class: "time-spacer",
              },
              {
                class: "length",
                textContent: "--:--",
              },
            ],
          },
          {
            class: "volume-container",
            children: [
              {
                class: "volume-button",
                child: new Icon("speaker"),
              },
              {
                class: "volume-slider",
                child: {
                  class: "volume-percentage",
                },
              },
            ],
          },
          // {
          //   class: "download-container",
          //   child: {
          //     tagName: "a",
          //     href: downloadLink || link,
          //     download: title,
          //     class: "download-button",
          //     child: {
          //       icon: { download },
          //     },
          //   },
          // },
        ],
      },
      {
        class: "timeline",
        child: {
          class: "progress",
        },
      },
    ],
  };
};
