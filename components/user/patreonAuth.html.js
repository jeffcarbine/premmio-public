// Modules
import { patreonOauthUrl } from "../../apis/patreon.js";

// Elements
import { H1, P } from "../../template/elements.html.js";

// Components
import { BtnContainer } from "../../components/btn/btn.html.js";
import { Icon } from "../../components/icon/icon.html.js";

/**
 * Generates the PatreonAuth component.
 *
 * @param {Object} data - The data for the component.
 * @returns {Object} The PatreonAuth component configuration.
 */
export const PatreonAuth = (data) => {
  return {
    class: "patreonAuth",
    children: [
      {
        class: "text-overlay",
        children: [
          new Icon("patreon"),
          new H1("Connect to Patreon"),
          new P(
            "Unlock additional posts on our website by connecting your Patreon account"
          ),
          new BtnContainer(
            {
              href: patreonOauthUrl,
              textContent: "Authenticate with Patreon",
            },
            "centered"
          ),
        ],
      },
    ],
  };
};

/**
 * Generates the AuthorizingPatreon component.
 *
 * @param {string} code - The authorization code.
 * @returns {Object} The AuthorizingPatreon component configuration.
 */
export const AuthorizingPatreon = (code) => {
  return {
    class: "patreonAuth",
    "data-component": "user/patreonAuth",
    children: [
      {
        class: "text-overlay",
        children: [
          new Icon("patreon"),
          new H1("Authorizing Patreon"),
          new P("Please wait while we authorize your Patreon account..."),
          {
            class: "loading",
          },
        ],
      },
    ],
  };
};
