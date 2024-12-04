// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";

// Components
import { PostCard } from "../postCard/postCard.html.js";

const results = document.getElementById("results"),
  search = document.getElementById("search"),
  loadMoreBlock = document.getElementById("loadMoreBlock"),
  loadMore = document.getElementById("loadMore"),
  showDescriptions = loadMore.dataset.descriptions === "true",
  showDate = loadMore.dataset.date === "true",
  useFirstFreeReward = loadMore.dataset.firstFreeReward === "true",
  postButton = loadMore.dataset.postButton === "true";

let query = "";

const loadMorePosts = (page) => {
  // check to see if the page requested is 1, which
  // means we are resetting
  if (page === 1) {
    results.innerHTML = "";
    results.classList.add("loading");
  }

  const success = (request) => {
    loadMore.classList.remove("loading");

    if (results.classList.contains("loading")) {
      results.classList.remove("loading");
    }

    const response = JSON.parse(request.response),
      posts = response.docs,
      nextPage = response.nextPage;

    posts.forEach((post) => {
      post.showDescription = showDescriptions;
      post.showDate = showDate;
      post.useFirstFreeReward = useFirstFreeReward;
      post.button = postButton;

      App.render(new PostCard(post), null, (postCard) => {
        results.appendChild(postCard);
      });
    });

    if (nextPage) {
      loadMore.dataset.page = nextPage;
      loadMoreBlock.classList.remove("hidden");
    } else {
      loadMoreBlock.classList.add("hidden");
    }
  };

  // there will either be a group of radios with the collection name or a single
  // hidden input with the collection name and we need top pull whichever one it is
  const collectionInputs = Array.from(
    document.querySelectorAll("input[name='collection']")
  );

  let collections = [];

  if (collectionInputs.length) {
    // if the radio that is checked is "all", then we need the values of the other radios
    const checkedInput = collectionInputs.find((input) => input.checked);

    if (checkedInput.value === "all") {
      collections = [...collectionInputs]
        .filter((input) => input.value !== "all")
        .map((input) => input.value);
    } else {
      collections = [checkedInput.value];
    }
  } else {
    collections = [collectionInputs[0].value];
  }

  xhr({
    path: "/premmio/client/posts",
    body: { page, query, collections },
    success,
  });
};

// run on page laod
loadMorePosts(1, "");

const loadMoreClick = (button) => {
  button.classList.add("loading");

  const page = button.dataset.page;
  query = search.value;

  loadMorePosts(page);
};

addEventDelegate("click", "#loadMore", loadMoreClick);

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const searchQuery = debounce((input) => {
  query = input.value;
  loadMorePosts(1);
}, 500);

addEventDelegate("input", "#search", searchQuery);

const suggestionQuery = (button) => {
  query = button.textContent;
  search.value = query;

  loadMorePosts(1);
};

addEventDelegate("click", "#suggestions .btn", suggestionQuery);

const toggleCollections = (input) => {
  const collection = input.value;

  if (collection === "all") {
    document.querySelectorAll("input[name='collection']").forEach((input) => {
      input.checked = false;
    });
  } else {
    document.querySelector(
      "input[name='collection'][value='all']"
    ).checked = false;
  }

  input.checked = true;

  loadMorePosts(1);
};

addEventDelegate("change", "input[name='collection']", toggleCollections);
