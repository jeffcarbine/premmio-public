// Modules
import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";

// Elements

import { Btn } from "../../components/btn/btn.html.js";
import { Field } from "../../components/field/field.html.js";
import { SquareCardContainer } from "../../components/user/squareCardContainer.html.js";

/**
 * Generates the SelectTier component.
 *
 * @param {Array<Object>} tiers - The array of tier objects.
 * @returns {Object} The SelectTier component configuration.
 */
export const SelectTier = (tiers) => {
  // sort the tiers by amount
  tiers.sort((a, b) => {
    return a.amount - b.amount;
  });

  /**
   * Generates the tier options for the select input.
   *
   * @returns {Array<Object>} The array of tier options.
   */
  const generateTierOptions = () => {
    const options = [];

    tiers.forEach((tier) => {
      options.push({
        value: tier.amount,
        name: `${tier.title} - ${formatCents(tier.amount)}/Month`,
      });
    });

    return options;
  };

  /**
   * Generates the tier descriptions.
   *
   * @returns {Array<Object>} The array of tier descriptions.
   */
  const generateTierDescriptions = () => {
    const descriptions = [];

    tiers.forEach((tier) => {
      descriptions.push({
        id: `tierDescription${tier.amount}`,
        textContent: tier.description,
        style: {
          display: "none",
        },
      });
    });

    return descriptions;
  };

  return {
    id: "selectTier",
    children: [
      new Field({
        type: "select",
        id: "pledge",
        name: "pledge",
        required: true,
        label: "Tier",
        options: generateTierOptions(),
      }),
      {
        id: "tierDescriptions",
        children: generateTierDescriptions(),
      },
      SquareCardContainer,
      new Btn({
        id: "submitCardData",
        textContent: "Submit",
      }),
    ],
  };
};
