// Components
import { flags } from "./flags.js";

/**
 * Class representing a flag.
 */
export class FLAG {
  /**
   * Creates an instance of FLAG.
   *
   * @param {string} countryCode - The country code for the flag.
   */
  constructor(countryCode) {
    this.class = `flag flag-${countryCode.toLowerCase()}`;
    this.innerHTML = flags[countryCode];
  }
}
