// Models
import Page from "../../../private/models/Page.js";
import Episode from "../../../private/models/Episode.js";

// Third-Party Imports
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";

/**
 * Generates sitemap and robots.txt for the application.
 *
 * @param {Object} app - The Express application instance.
 * @param {string} hostname - The hostname for the sitemap.
 */
export const sitemapAndRobots = (app, hostname) => {
  let sitemap;

  app.get("/sitemap.xml", async (req, res) => {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    // if we have a cached entry send it
    if (sitemap) {
      res.send(sitemap);
      return;
    }

    try {
      const smStream = new SitemapStream({ hostname });
      const pipeline = smStream.pipe(createGzip());

      // get all the pages from the database where active = true
      const pages = await Page.find({ active: true });

      for (const page of pages) {
        if (page.wildcard === "none") {
          // this is a standard page and we can just add it to the sitemap
          smStream.write({ url: page.path, changefreq: "monthly" });
        } else if (page.wildcard === "episode") {
          // get all the episodes and create the page for each episode
          const episodes = await Episode.find();

          for (const episode of episodes) {
            smStream.write({
              url: `${page.path}/${episode.localPath}`,
              changefreq: "monthly",
            });
          }
        }
      }

      // cache the response
      sitemap = await streamToPromise(pipeline);

      // make sure to attach a write stream such as streamToPromise before ending
      smStream.end();

      // stream write the response
      pipeline.pipe(res).on("error", (e) => {
        throw e;
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  app.get("/robots.txt", (req, res) => {
    const text = `
      User-agent: *
      Disallow: 
      Disallow: /admin
      Sitemap: ${hostname}/sitemap.xml`;

    res.type("text/plain");
    res.send(text);
  });
};
