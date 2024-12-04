import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { REWARDPREVIEW } from "./postPreview.html.js";
import { REWARDCard } from "./postCard.html.js";

const latestPostsList = document.getElementById("latestPostsList"),
  loadMore = document.getElementById("loadMore"),
  loadMoreBtn = document.getElementById("loadMoreLatestPosts");

const renderLatestPosts = (posts) => {
  loadMoreBtn.classList.remove("loading");
  latestPostsList.classList.remove("loading");

  posts.forEach((post) => {
    latestPostsList.appendChild(renderTemplate(REWARDCard(post)));
  });
};

const getLatestPosts = (page = 1) => {
  loadMoreBtn.classList.add("loading");

  const success = (request) => {
    const response = JSON.parse(request.responseText),
      posts = response.docs,
      nextPage = response.nextPage;

    renderLatestPosts(posts);

    if (nextPage) {
      loadMoreBtn.dataset.page = nextPage;
      loadMore.style.display = "block";
    } else {
      loadMore.style.display = "none";
    }
  };

  xhr({ path: "/premmio/premium", body: { page }, success });
};

getLatestPosts();

const loadMoreLatestPosts = (button) => {
  const page = button.dataset.page;

  getLatestPosts(page);
};

addEventDelegate("click", "#loadMoreLatestPosts", loadMoreLatestPosts);
