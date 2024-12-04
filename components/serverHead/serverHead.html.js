import fs from "fs";
import path from "path";

import {
  Head,
  Meta,
  Title,
  Link,
  PreLoadStyle,
  Stylesheet,
  Style,
  Script,
} from "../../template/elements.html.js";

export class ServerHead extends Head {
  constructor(params) {
    super(params);

    this.children = [];

    if (params.title !== undefined) {
      const title = new Title({
        textContent: params.title,
      });

      this.children.push(title);
    }

    if (params.metas !== undefined && Array.isArray(params.metas)) {
      for (let i = 0; i < params.metas.length; i++) {
        const meta = params.metas[i];

        const metaChip = new Meta({
          name: meta.name,
          content: meta.content,
        });

        this.children.push(metaChip);
      }
    }

    if (params.links !== undefined && Array.isArray(params.links)) {
      for (let i = 0; i < params.links.length; i++) {
        const link = params.links[i],
          linkChip = new Link();

        for (let key in link) {
          linkChip[key] = link[key];
        }

        this.children.push(linkChip);
      }
    }

    if (
      params?.styles?.base !== undefined &&
      Array.isArray(params?.styles?.base) &&
      params?.styles?.base.length > 0
    ) {
      const baseStyles = params?.styles?.base;

      baseStyles.forEach((href) => {
        let stylesheetChip;

        // make sure the href doesn't have two leading slashes
        if (href.startsWith("//")) {
          href = href.slice(1);
        }

        if (process.env.NODE_ENV === "development") {
          stylesheetChip = new Link({
            rel: "stylesheet",
            class: "non-critical-style",
            href,
          });
        } else {
          stylesheetChip = new PreLoadStyle({
            href,
          });
        }

        this.children.push(stylesheetChip);
      });
    }

    if (
      params?.styles?.critical !== undefined &&
      Array.isArray(params?.styles?.critical) &&
      params?.styles?.critical.length > 0
    ) {
      const criticalStyles = params?.styles?.critical;

      let criticalStyle;

      // if the head tag is being generated on the server, then we need to
      // read the stylesheets and render them as inline styles
      criticalStyles.forEach((href) => {
        // make sure the href doesn't have two leading slashes
        if (href.startsWith("//")) {
          href = href.slice(1);
        }

        const filePath = path.join(process.cwd(), href),
          styles = fs.readFileSync(filePath, "utf8");

        if (process.env.NODE_ENV === "development") {
          // if we're in development, we can just link the stylesheets
          criticalStyle = new Stylesheet({
            href,
            onload: `setTimeout(() => {
            const nonCriticalStylesheets = document.querySelectorAll(
              ".non-critical-style"
            );

            nonCriticalStylesheets.forEach((stylesheet) => {
              stylesheet.rel = "stylesheet";
            });
          }, 2000);`,
          });
        } else {
          criticalStyle = new Style({
            textContent: styles,
            "data-critical": true,
          });
        }

        this.children.push(criticalStyle);
      });
    }

    if (params.typekit !== undefined && typeof params.typekit === "string") {
      const typekitLink = new PreLoadStyle({
        href: `https://use.typekit.net/${params.typekit}.css`,
      });

      this.children.push(typekitLink);
    }

    if (
      params.scripts !== undefined &&
      Array.isArray(params.scripts) &&
      params.scripts.length > 0
    ) {
      for (let i = 0; i < params.scripts.length; i++) {
        const script = params.scripts[i],
          scriptChip = new Script(script);

        // if the script is already a Module or Script, then don't wrap it
        if (script instanceof Script || script instanceof Module) {
          this.children.push(script);
          continue;
        } else {
          this.children.push(scriptChip);
        }
      }
    }

    if (
      params.favicons !== undefined &&
      Array.isArray(params.favicons) &&
      params.favicons.length > 0
    ) {
      for (let i = 0; i < params.favicons.length; i++) {
        const favicon = params.favicons[i],
          faviconChip = new Link(favicon);

        this.children.push(faviconChip);
      }
    }

    if (params.inlineStyles !== undefined) {
      const inlineStyles = new Style({
        textContent: params.inlineStyles,
      });

      this.children.push(inlineStyles);
    }
  }
}
