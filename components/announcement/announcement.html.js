// Elements
import { P, H2 } from "../../template/elements.html.js";

// Components
import { Btn, BtnContainer } from "../../components/btn/btn.html.js";
import { Modal } from "../../components/modal/modal.html.js";

// Modules
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

/**
 * Class representing an announcement component.
 */
export class Announcement {
  /**
   * Creates an instance of Announcement.
   *
   * @param {Object} params - The parameters for the announcement.
   * @param {string} params.previewText - The preview text for the announcement.
   * @param {string} [params.readMoreText="Read More"] - The text for the read more button.
   * @param {string} [params.href] - The URL for the read more button.
   * @param {string} [params.title] - The title of the announcement.
   * @param {string} [params.body] - The body content of the announcement.
   * @param {string} [params.viewMoreText="View More"] - The text for the view more button.
   * @param {boolean} [params.if] - The condition to render the announcement.
   */
  constructor(params) {
    const uniqueId = generateUniqueId();

    const actionBtn = {
      class: "sm",
      textContent: params.readMoreText || "Read More",
    };

    if (params.body && params.title) {
      actionBtn["data-modal"] = uniqueId;
    } else {
      actionBtn.href = params.href;
      actionBtn.target = params.href?.includes("http") ? "_blank" : "_self";
    }

    this["data-component"] = "announcement";
    this.if = params.if;
    this.children = [
      {
        children: [
          new P({
            textContent: params.previewText,
          }),
          new Btn(actionBtn),
        ],
      },
      Modal({
        if: params.body && params.title,
        id: uniqueId,
        modalTitle: params.title,
        modalBody: {
          innerHTML: params.body,
          append: {
            if: params.href,
            child: new BtnContainer(
              {
                class: "accent",
                textContent: params.viewMoreText || "View More",
                href: params.href,
                target: params.href?.includes("http") ? "_blank" : "_self",
              },
              "centered"
            ),
          },
        },
      }),
    ];
  }
}
