(() => {
  document.getElementById("file-input").onchange = () => {
    const files = document.getElementById("file-input").files;
    const file = files[0];
    if (file == null) {
      return alert("No file selected.");
    }
    getSignedRequest(file);
  };
})();

/**
 * Gets a signed request from the server to upload a file to S3.
 *
 * @param {File} file - The file to upload.
 */
function getSignedRequest(file) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      } else {
        alert("Could not get signed URL.");
      }
    }
  };
  xhr.send();
}

/**
 * Uploads a file to S3 using a signed request.
 *
 * @param {File} file - The file to upload.
 * @param {string} signedRequest - The signed request URL.
 * @param {string} url - The URL of the uploaded file.
 */
function uploadFile(file, signedRequest, url) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", signedRequest);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        document.getElementById("preview").src = url;
        document.getElementById("avatar-url").value = url;
      } else {
        alert("Could not upload file.");
      }
    }
  };
  xhr.send(file);
}
