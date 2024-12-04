/**
 * Class representing an embedded Spotify player.
 */
export class EmbeddedSpotifyPlayer {
  /**
   * Creates an instance of EmbeddedSpotifyPlayer.
   *
   * @param {string} spotifyUri - The Spotify URI for the embedded player.
   */
  constructor(spotifyUri) {
    this.class = "embeddedSpotifyPlayer";
    this["data-component"] = "embeddedSpotifyPlayer";
    this.child = {
      class: "embed-iframe",
      "data-spotifyUri": spotifyUri,
    };
  }
}
