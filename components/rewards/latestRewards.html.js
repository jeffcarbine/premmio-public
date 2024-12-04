import { H2 } from "../../elements/headings/headings.html.js";
import { BtnContainer } from "../btn/btn.html.js";

export const LATESTREWARDS = (accessKeys = []) => {
  return {
    id: "latestPosts",
    "data-component": "posts/latestPosts",
    children: [
      new H2("Latest Posts"),
      {
        id: "latestPostsList",
        "data-access-keys": JSON.stringify(accessKeys),
        class: "loading",
      },
      {
        id: "loadMore",
        style: {
          display: "none",
        },
        child: new BtnContainer(
          {
            id: "loadMoreLatestPosts",
            textContent: "Load More",
          },
          "centered"
        ),
      },
    ],
  };
};
