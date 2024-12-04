// Modules
import { xhr } from "../../modules/xhr/xhr.js";

/**
 * Handles the success response from the XHR request.
 *
 * @param {Object} request - The XHR request object.
 */

// get the code from the query parameters
const query = new URLSearchParams(window.location.search);
const code = query.get("code");

// send the code via xhr
xhr({ path: "/user/patreonAuth", body: { code }, success });
