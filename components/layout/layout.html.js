// Standard Library Imports
import fs from "fs";
import path from "path";

// Elements
import { Body, Module, Script } from "../../template/elements.html.js";

// Components
import { CookieConsent } from "../cookieConsent/cookieConsent.html.js";
import { ServerHead } from "../serverHead/serverHead.html.js";

/**
 * Class representing the layout of the HTML document.
 */
export class Layout {
  /**
   * Creates an instance of Layout.
   *
   * @param {Object} params - The parameters for the layout.
   */
  constructor(params) {
    this.tagName = "html";
    this.lang = params.lang || "en";

    // cookies
    const cookies = params.data?.cookies,
      cookiesDetected =
        cookies?.analyticCookies !== undefined &&
        cookies?.marketingCookies !== undefined,
      analyticCookiesDetected = cookies?.analyticCookies !== undefined,
      analyticCookiesOn = cookies?.analyticCookies === "true",
      marketingCookiesDetected = cookies?.marketingCookies !== undefined,
      marketingCookiesOn = cookies?.marketingCookies === "true";

    const criticals = [],
      bases = [],
      scripts = [];

    const dist = params.dist || "dist";

    // check if the base critical, base and script exist
    try {
      if (
        fs.existsSync(path.resolve(process.cwd(), `${dist}/styles/base.css`))
      ) {
        bases.push(`/${dist}/styles/base.css`);
      }

      if (
        fs.existsSync(
          path.resolve(process.cwd(), `${dist}/styles/critical.css`)
        )
      ) {
        criticals.push(`/${dist}/styles/critical.css`);
      }

      if (
        fs.existsSync(
          path.resolve(process.cwd(), `${dist}/scripts/base.scripts.js`)
        )
      ) {
        scripts.push(new Module({ src: `/${dist}/scripts/base.scripts.js` }));
      }
    } catch (e) {
      console.warn(e);
    }

    // first check if the corresponding critical and base styles and page script exist
    // based on the page path (ie: /pages/about-us) by splitting the path and checking
    // for each part of the path in it's corresponding directory
    const urlPaths =
      params.data.path === "/"
        ? ["home"]
        : params.data.path
            .split("/")
            .filter((part) => part !== "" && part !== params.pathModifier);

    let filepaths = [];

    for (let i = 0; i < urlPaths.length; i++) {
      let urlPath = urlPaths.slice(0, i + 1);

      if (
        (params.data.wildcard &&
          params.data?.wildcard !== "none" &&
          i === urlPaths.length - 1) ||
        urlPath[urlPath.length - 1] === "*"
      ) {
        // make two wildcard paths, one with the previous_path/path + _$
        // and another with the previous_path/path/path + _s
        let wildcardPath1 = `${urlPath.slice(0, -2).join("/")}/${
          urlPath[urlPath.length - 2]
        }_$`;

        filepaths.push(wildcardPath1);

        let wildcardPath2 = `${urlPath.slice(0, -1).join("/")}/${
          urlPath[urlPath.length - 2]
        }_$`;

        filepaths.push(wildcardPath2);
      } else {
        filepaths.push(urlPath.join("/"));
        let formattedPath = `${urlPath.join("/")}/${
          urlPath[urlPath.length - 1]
        }`;

        filepaths.push(formattedPath);
      }
    }

    // if not including parent scripts, then we need to modify the filepaths
    if (!params.inherit) {
      // if the last path is a *, then we need to reduce the array to the ones that contain a _$
      // if (filepaths[filepaths.length - 1].includes("_$")) {
      //   filepaths = [filepaths[filepaths.length - 1]];
      // } else if (params.data.wildcard && params.data?.wildcard !== "none") {
      //   // if this is a wildcard page, then we need to reduce it to the third/fourth to last entires
      //   filepaths = [
      //     filepaths[filepaths.length - 4],
      //     filepaths[filepaths.length - 3],
      //   ];
      if (filepaths[filepaths.length - 1].includes("_$")) {
        // reduce the array to only entries that contain a _$
        filepaths = filepaths.filter((path) => path.includes("_$"));
      } else {
        // then we need to reduce the array to just the last two entries, if there are more than two entires
        if (filepaths.length > 2) {
          filepaths = [
            filepaths[filepaths.length - 2],
            filepaths[filepaths.length - 1],
          ];
        }
      }
    }

    for (let i = 0; i < filepaths.length; i++) {
      const formattedPath = filepaths[i];

      const critical = `${dist}/styles/pages/${formattedPath}.critical.css`,
        base = `${dist}/styles/pages/${formattedPath}.base.css`,
        script = `${dist}/scripts/${formattedPath}.scripts.js`;

      if (fs.existsSync(path.resolve(process.cwd(), critical))) {
        criticals.push(`/${critical}`);
      }

      if (fs.existsSync(path.resolve(process.cwd(), base))) {
        bases.push(`/${base}`);
      }

      if (fs.existsSync(path.resolve(process.cwd(), script))) {
        scripts.push(new Module({ src: `/${script}` }));
      }
    }

    const head = {
      title: params.title,
      links: params.links,
      styles: {
        critical: [
          ...criticals,
          ...(Array.isArray(params.styles?.critical)
            ? params.styles.critical
            : params.styles?.critical
            ? Array.of(params.styles.critical)
            : []),
        ],
        base: [
          ...bases,
          ...(Array.isArray(params.styles?.base)
            ? params.styles.base
            : params.styles?.base
            ? Array.of(params.styles.base)
            : []),
        ],
      },
      typekit: params.typekit,
      metas: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        ...(params.description
          ? [{ name: "description", content: params.description }]
          : []),
        ...(params?.metas || []),
      ],
    };

    const body = params.body;

    if (params.gdpr !== false) {
      const consent = CookieConsent({
        cookiesDetected,
        analyticCookiesOn,
        marketingCookiesOn,
        analyticCookiesDetected,
        marketingCookiesDetected,
        policyName: "Privacy Policy",
        policyHref: "/privacy-policy",
        doubleUp: params.cookieConsentDoubleUp || false,
      });

      if (Array.isArray(body)) {
        body.push(consent);
      } else {
        body.children.push(consent);
      }
    }

    const pageScripts = [
      new Script({
        if:
          analyticCookiesOn &&
          params.analytics.startsWith("G-") &&
          !params.analytics.startsWith("GTM-"),
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${params.analytics}`,
      }),
      new Script({
        if:
          analyticCookiesOn &&
          params.analytics.startsWith("G-") &&
          !params.analytics.startsWith("GTM-"),
        textContent: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${params.analytics}', {
            'linker': {
              'domains': ['myshopify.com',]
            }
          });`,
      }),
      new Script({
        if: analyticCookiesOn && params.analytics.startsWith("GTM-"),
        textContent: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${params.analytics}');
    
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
    
          gtag('config', '${params.analytics}', {
            'linker': {
              'domains': ['myshopify.com']
            }
          });
        `,
      }),
      new Module({
        src: "/premmio/public/components/component-loader.js",
      }),
      ...scripts,
      ...(typeof params.scripts === "string"
        ? Array.of(params.scripts)
        : params.scripts ?? []),
    ];

    if (Array.isArray(body)) {
      body.push(...pageScripts);
    } else {
      body.children.push(...pageScripts);
    }

    if (params.style) {
      this.style = params.style;
    }

    if (params["data-theme"] !== undefined) {
      this["data-theme"] = params["data-theme"];
    }

    this.children = [new ServerHead(head), new Body(body)];
  }
}
