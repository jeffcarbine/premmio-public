// Components
import { flagSquares } from "./flagSquares.js";

/**
 * Class representing a flag square.
 */
export class FlagSquare {
  /**
   * Creates an instance of FlagSquare.
   *
   * @param {string} countryCode - The country code for the flag.
   */
  constructor(countryCode) {
    this.class = `flagsquare flag-${countryCode.toLowerCase()}`;
    this.innerHTML = flagSquares[countryCode];
  }
}
