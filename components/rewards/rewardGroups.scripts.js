import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { REWARDGROUP } from "./collections.html.js";

const success = (request) => {
  const collectionsList = document.querySelector("#collectionsList");
  collectionsList.classList.remove("loading");

  const posts = JSON.parse(request.response);

  posts.forEach((post) => {
    const collection = REWARDGROUP(post);

    collectionsList.appendChild(renderTemplate(collection));
  });
};

xhr({ path: "/premmio/premium/retrieveCollections", success });
