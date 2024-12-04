// Modules
import { truncateHtml } from "../../modules/truncate/truncate.js";

// Components
import { ResponsiveImg } from "../responsiveImg/responsiveImg.html.js";

// Elements
import { H2, Span } from "../../template/elements.html.js";
import { BtnContainer } from "../btn/btn.html.js";
import { formatDate } from "../../modules/formatDate/formatDate.js";

export class PostCard {
  constructor(post) {
    this.class = "postCard";
    this.children = [new ResponsiveImg(post.image), new H2(post.title)];

    if (post.showDate) {
      this.children.push(
        new Span({
          class: "date",
          textContent: formatDate(post.published),
        })
      );
    }

    if (post.showDescription) {
      this.children.push({
        class: "description",
        innerHTML: truncateHtml(post.description, 100),
      });
    }

    const href = post.useFirstFreeReward
      ? post.freeRewards[0].url
      : `/post/${post.localpath}`;

    if (post.button !== false) {
      this.children.push(
        new BtnContainer(
          {
            href,
            textContent: "View",
            target: post.useFirstFreeReward ? "_blank" : "",
          },
          "centered"
        )
      );
    } else {
      this.tagName = "a";
      this.href = href;
    }
  }
}
