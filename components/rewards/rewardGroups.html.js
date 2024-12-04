import { H2 } from "../../elements/headings/headings.html.js";
import { Card } from "../card/card.html.js";

// export const REWARDGROUP = (group) => {
//   const cardData = {
//     heading: new H2(group.title),
//     body: {
//       class: "description",
//       innerHTML: group.description,
//     },
//     actions: [
//       {
//         textContent: "View Group",
//         href: `/premium/group/${group.localpath}`,
//       },
//     ],
//     className: "collection",
//   };

//   if (group.image) {
//     cardData.image = group.image;
//     cardData.fullImage = true;
//   }

//   return Card(cardData);
// };

export const REWARDGROUPS = () => {
  return {
    id: "collections",
    "data-component": "posts/collections",
    children: [
      new H2("Browse Posts by Group"),
      {
        id: "collectionsList",
        class: "cardGrid loading",
      },
    ],
  };
};
