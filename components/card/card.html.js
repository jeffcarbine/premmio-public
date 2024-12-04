// Components
import { BtnContainer } from "../btn/btn.html.js";
import { ResponsiveImg } from "../responsiveImg/responsiveImg.html.js";

/**
 * Creates a card component.
 *
 * @param {Object} params - The parameters for the card component.
 * @param {Object} [params.body={}] - The body content of the card.
 * @param {string} [params.heading] - The heading of the card.
 * @param {string} [params.subheading] - The subheading of the card.
 * @param {Object} [params.image] - The image of the card.
 * @param {boolean} [params.fullImage=false] - Whether the image is full width.
 * @param {Object} [params.actions] - The actions for the card.
 * @param {string} [params.actionsAlignment=""] - The alignment of the actions.
 * @param {string} [params.className=""] - The class name for the card.
 * @returns {Object} The card component configuration.
 */
export const Card = ({
  body = {},
  heading,
  subheading,
  image,
  fullImage = false,
  actions,
  actionsAlignment = "",
  className = "",
} = {}) => {
  const children = [body];

  if (subheading)
    children.unshift({ class: "subheading", textContent: subheading });

  if (heading)
    children.unshift({
      class: "heading",
      child: heading,
    });

  if (image)
    children.unshift({
      class: `card-image ${fullImage ? "full" : ""}`,
      child: new ResponsiveImg(image),
    });

  if (actions)
    children.push({
      class: "actions",
      child: new BtnContainer(actions, `minimal ${actionsAlignment}`),
    });

  return {
    class: "card " + className,
    children,
  };
};
