/**
 * Cookies
 * This handles adding, modifying and removing cookies
 */

/**
 * Set Cookie
 * Set a cookie name, value and expiration
 *
 * @param {string} name The name of your cookie
 * @param {number} value The value of that cookie
 * @param {number} days The expiration on that cookie
 */

export const setCookie = (name, value, days) => {
  // default expiry to nothing
  let expires = "";

  if (days) {
    // calculate the days
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    // update expires
    expires = "; expires=" + date.toUTCString();
  }

  // write the cookie
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

/**
 * Get Cookie
 * Read a cookie
 *
 * @param {string} name The name of the cookie you want to read
 */

export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Erase Cookie
 * Cookie be gone!
 *
 * @param {string} name The name of the cookie you wish to destroy
 */

export const eraseCookie = (name) => {
  document.cookie = name + "=; Max-Age=-99999999;";
};
