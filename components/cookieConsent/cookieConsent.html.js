// Elements
import { A, Form, H2, P } from "../../template/elements.html.js";

// Components
import { BtnContainer } from "../btn/btn.html.js";
import { Field } from "../field/field.html.js";
import { Modal } from "../modal/modal.html.js";

/**
 * Creates a cookie consent modal.
 *
 * @param {Object} params - The parameters for the cookie consent modal.
 * @param {boolean} [params.cookiesDetected=false] - Whether cookies are detected.
 * @param {boolean} [params.analyticCookiesDetected=false] - Whether analytic cookies are detected.
 * @param {boolean} [params.analyticCookiesOn=true] - Whether analytic cookies are enabled.
 * @param {boolean} [params.marketingCookiesDetected=false] - Whether marketing cookies are detected.
 * @param {boolean} [params.marketingCookiesOn=true] - Whether marketing cookies are enabled.
 * @param {boolean} [params.marketingCookiesUsed=false] - Whether marketing cookies are used.
 * @param {string} [params.policyName="Cookie Policy"] - The name of the cookie policy.
 * @param {string} [params.policyHref="/cookie-policy"] - The href for the cookie policy.
 * @param {boolean} [params.doubleUp=false] - Whether to double up the consent modal.
 * @returns {Object} The cookie consent modal configuration.
 */
export const CookieConsent = ({
  cookiesDetected = false,
  analyticCookiesDetected = false,
  analyticCookiesOn = true,
  marketingCookiesDetected = false,
  marketingCookiesOn = true,
  marketingCookiesUsed = false,
  policyName = "Cookie Policy",
  policyHref = "/cookie-policy",
  doubleUp = false,
}) => {
  return {
    id: "cookieConsent",
    "data-component": "cookieConsent",
    children: [
      {
        class: `message ${cookiesDetected ? "hidden" : ""}`,
        children: [
          {
            class: "explanation",
            children: [
              new H2("Cookie Consent"),
              new P([
                "Hello! We use essential cookies in order to make our site function - however, with your consent, we may also use non-essential cookies to improve user experience and analyze website traffic. By clicking 'Accept All', you agree to the storing of non-essential cookies on your device. You can learn more about how we use cookies by visiting our ",
                new A({ href: policyHref, textContent: policyName }),
                ".",
              ]),
              new P(
                "You can change your cookie settings now by clicking 'Preferences' or at any time by going to 'Cookie Preferences' in the footer."
              ),
            ],
          },
          {
            class: "actions",
            child: new BtnContainer(
              [
                {
                  class: "sm",
                  textContent: "Accept All",
                  id: "acceptAllCookies",
                  doubleUp,
                },
                {
                  class: "subtle sm",
                  textContent: "Preferences",
                  "data-modal": "cookieToggle",
                  doubleUp,
                },
              ],
              "centered"
            ),
          },
        ],
      },
      Modal({
        modalBody: {
          children: [
            new H2("Cookie Preferences"),
            new P([
              "We use different types of cookies to optimize your experience on our website. You may choose which types of cookies to allow and can change your preferences at any time. Remember that disabling cookies may affect your experience on the website. You can learn more about how we use cookies by visiting our ",
              new A({ href: policyHref, textContent: policyName }),
              ".",
            ]),
            new Form({
              id: "cookiePreferences",
              children: [
                new Field({
                  type: "checkbox",
                  id: "necessary",
                  checked: true,
                  disabled: true,
                  label: "Necessary",
                  help: "These cookies are essential for the website to function, and cannot be disabled.",
                }),
                new Field({
                  type: "checkbox",
                  id: "analytics",
                  label: "Analytics",
                  checked: analyticCookiesDetected ? analyticCookiesOn : true,
                  name: "analyticCookies",
                  help: "These cookies help us understand how visitors interact with the website, and help us to continuously improve the user experience.",
                }),
                new Field({
                  if: marketingCookiesUsed,
                  type: "checkbox",
                  id: "marketing",
                  label: "Marketing",
                  checked: marketingCookiesDetected ? marketingCookiesOn : true,
                  name: "marketingCookies",
                  help: "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging.",
                }),
                new BtnContainer({
                  id: "saveCookiePreferences",
                  class: "sm",
                  textContent: "Save Preferences",
                  doubleUp,
                }),
              ],
            }),
          ],
        },
        id: "cookieToggle",
      }),
    ],
  };
};
