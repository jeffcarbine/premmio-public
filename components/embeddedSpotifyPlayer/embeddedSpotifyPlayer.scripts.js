/**
 * Adds an external JS file to the DOM.
 *
 * @param {string} url - The URL of the external script.
 * @param {Function} callback - The callback function to execute once the script is loaded.
 */
function addExternalScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.onload = callback; // Call the callback once the script is loaded
  document.head.appendChild(script);
}

// Add the Spotify embed podcast iframe API script to the DOM
addExternalScript(
  "https://open.spotify.com/embed-podcast/iframe-api/v1",
  () => {
    const spotifyIframes = document.querySelectorAll(
      '[data-component="embeddedSpotifyPlayer"] .embed-iframe'
    );

    /**
     * Initializes the Spotify IFrame API.
     *
     * @param {Object} IFrameAPI - The Spotify IFrame API object.
     */
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      spotifyIframes.forEach((spotifyIframe) => {
        const spotifyUri = spotifyIframe.dataset.spotifyuri;

        const options = {
          uri: spotifyUri,
        };

        const callback = (EmbedController) => {};
        IFrameAPI.createController(spotifyIframe, options, callback);
      });
    };
  }
);
