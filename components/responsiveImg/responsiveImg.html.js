import { Img } from "../../template/elements.html.js";

/**
 * Class representing a responsive image.
 */
export class ResponsiveImg extends Img {
  /**
   * Creates an instance of ResponsiveImg.
   *
   * @param {Object} params - The parameters for the responsive image.
   */
  constructor(params) {
    super(params);

    const keys = ["src_xs", "src_sm", "src_md", "src_lg", "src_xl"];
    const srcset = [];

    const widthMap = {
      src_xs: "480w",
      src_sm: "768w",
      src_md: "1024w",
      src_lg: "1200w",
      src_xl: "1600w", // New width for xl
    };

    const sizesMap = {
      src_xs: "(max-width: 480px) 480px",
      src_sm: "(max-width: 768px) 768px",
      src_md: "(max-width: 1024px) 1024px",
      src_lg: "(max-width: 1200px) 1200px",
      src_xl: "1600px", // Default size for xl
    };

    let defaultSrc = null;
    let srcCount = 0;
    const sizes = [];

    keys.forEach((key, index) => {
      if (params[key]) {
        srcCount++;
        // Add to srcset if it's a breakpoint-specific src
        const width = widthMap[key];
        srcset.push(`${params[key]} ${width}`);

        // Add to sizes if it's a breakpoint-specific size
        sizes.push(sizesMap[key]);

        // Set the default src to the next largest value in the key
        if (index < keys.length - 1 && params[keys[index + 1]]) {
          defaultSrc = params[keys[index + 1]];
        }
      }
    });

    // If only one src is provided, set it as the default src
    if (srcCount === 1) {
      defaultSrc = params[keys.find((key) => params[key])];
    }

    // Ensure a default src is set
    if (!defaultSrc && srcset.length > 0) {
      defaultSrc = srcset[0].split(" ")[0];
    }

    // Set the srcset attribute if multiple sources are provided
    if (srcCount > 1) {
      this.srcset = srcset.join(", ");
      this.sizes = sizes.join(", ");
    }

    // Set the default src attribute
    if (defaultSrc) {
      this.src = defaultSrc;
    }
  }
}

/**
 * Creates a lazy responsive image component.
 *
 * @param {Object} options - The options for the lazy responsive image.
 * @param {string} options.src - The source URL of the image.
 * @param {string} [options.alt=""] - The alt text for the image.
 * @param {string} [options.className=""] - Additional class names for the image.
 * @param {Object} [options.breakpoints] - The breakpoints for the responsive image.
 * @returns {LazyResponsiveImg} The lazy responsive image component.
 */
export class LazyResponsiveImg extends ResponsiveImg {
  constructor(params) {
    super(params);

    this.loading = "lazy";
  }
}
