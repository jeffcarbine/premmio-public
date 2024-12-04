import { getCookie, setCookie } from "../../modules/cookies/cookies.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const hideCookieConsent = () => {
  document.querySelector("#cookieConsent .message").classList.add("hidden");

  // close the cookieToggle modal
  document.querySelector("#cookieToggle").close();
};

const setCookiePreference = (type, preference) => {
  setCookie(type, preference, 365);
};

const acceptAllCookies = () => {
  setCookiePreference("analyticCookies", true);
  setCookiePreference("marketingCookies", true);

  hideCookieConsent();
};

const saveCookiePreferences = (form) => {
  const formData = new FormData(form);

  setCookiePreference(
    "analyticCookies",
    formData.get("analyticCookies") === null ? "0" : "1"
  );
  setCookiePreference(
    "marketingCookies",
    formData.get("marketingCookies") === null ? "0" : "1"
  );

  hideCookieConsent();
};

addEventDelegate("click", "#acceptAllCookies", acceptAllCookies);
addEventDelegate("submit", "#cookiePreferences", saveCookiePreferences, true);
