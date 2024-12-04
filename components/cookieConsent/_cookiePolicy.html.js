// Elements
import { H2, P, Ul, Strong } from "../../template/elements.html.js";

/**
 * Creates a cookie policy component.
 *
 * @param {Object} params - The parameters for the cookie policy component.
 * @param {string} [params.clientName=""] - The name of the client.
 * @param {string} [params.clientUrl=""] - The URL of the client.
 * @returns {Object} The cookie policy component configuration.
 */
export const CookiePolicy = ({ clientName = "", clientUrl = "" } = {}) => {
  return [
    new P(
      `This Cookie Policy explains how ${clientName} ("Company," "we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website at ${clientUrl} ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.`
    ),
    new P(
      "In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information."
    ),
    new H2("What are cookies?"),
    new P(
      "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information."
    ),
    new P(
      `Cookies set by the website owner (in this case, ${clientName}) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.`
    ),
    new H2("Why do we use cookies?"),
    new P(
      'We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.'
    ),
    new H2("How can I control cookies?"),
    new P(
      "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services."
    ),
    new P(
      "The Cookie Consent Manager can be found in the notification banner and on our website. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies."
    ),
    new P(
      "The specific types of first- and third-party cookies served through our Website and the purposes they perform are described in the table below (please note that the specific cookies served may vary depending on the specific Online Properties you visit):"
    ),
    new H2("Essential website cookies:"),
    new P(
      "These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas."
    ),
    {
      class: "cookie-definition",
      child: new Ul([
        [new Strong("Name: "), "analyticCookies"],
        [new Strong("Provider: "), clientName],
        [
          new Strong("Purpose: "),
          "Used to store user's analytic cookie consent state for the current domain.",
        ],
      ]),
    },
    {
      class: "cookie-definition",
      child: new Ul([
        [new Strong("Name: "), "marketingCookies"],
        [new Strong("Provider: "), clientName],
        [
          new Strong("Purpose: "),
          "Used to store user's marketing cookie consent state for the current domain.",
        ],
      ]),
    },
    {
      class: "cookie-definition",
      child: new Ul([
        [new Strong("Name: "), "connect.sid"],
        [new Strong("Provider: "), "express-session"],
        [
          new Strong("Purpose: "),
          "Preserves user session state across page requests.",
        ],
      ]),
    },
    {
      class: "cookie-definition",
      child: new Ul([
        [new Strong("Name: "), "checkoutId"],
        [new Strong("Provider: "), "Shopify"],
        [
          new Strong("Purpose: "),
          "Preserves user cart contents across page requests.",
        ],
      ]),
    },
    new H2("Analytics and customization cookies:"),
    new P(
      "These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you."
    ),
    {
      class: "cookie-definition",
      child: new Ul([
        [new Strong("Name: "), "_ga_*"],
        [new Strong("Provider: "), "Google"],
        [
          new Strong("Purpose: "),
          "Registers a unique ID that is used to generate statistical data on how the visitor uses the website.",
        ],
      ]),
    },
    {
      class: "cookie-definition",
      child: new Ul([
        [new Strong("Name: "), "_ga"],
        [new Strong("Provider: "), "Google"],
        [
          new Strong("Purpose: "),
          "Registers a unique ID that is used to generate statistical data on how the visitor uses the website.",
        ],
      ]),
    },
    // new H2("Advertising cookies:"),
    // new P(
    //   "These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests."
    // ),
  ];
};
