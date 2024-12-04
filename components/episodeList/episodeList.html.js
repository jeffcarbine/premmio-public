import { Element } from "../../template/elements.html.js";
import { Loader } from "../loader/loader.html.js";
import { Paginator } from "../paginator/paginator.html.js";

export class EpisodeList extends Element {
  constructor(params) {
    super(params);

    this["data-component"] = "episodeList";

    this.children = [
      {
        id: "results",
        children: (data, e, c) => {
          const episodes = [];

          data.docs.forEach((episode) => {
            episodes.push(
              c.EpisodeBlock({
                episode,
              })
            );
          });

          return episodes;
        },
      },
      new Paginator({
        action: "/premmio/client/episodes",
        binding: "episodes",
      }),
    ];
  }
}
