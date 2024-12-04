// import { H1 } from "../../elements/headings/headings.html.js";
// import { REWARDBOX } from "./postBox.html.js";
// import { REWARDCard } from "./postCard.html.js";

// const generateGroupPosts = (posts, displayStyle, accessKeys) => {
//   const children = [];

//   if (displayStyle === "list") {
//     posts.forEach((post) => {
//       children.push(REWARDCard(post, accessKeys));
//     });
//   } else if (displayStyle === "grid") {
//     posts.forEach((post) => {
//       children.push(REWARDBOX(post));
//     });
//   }

//   return children;
// };

// export const REWARDGROUP = (group, accessKeys = []) => {
//   const displayStyle = group.displayStyle || "list";

//   return {
//     class: `collection ${displayStyle}`,
//     children: [
//       {
//         id: "collectionTitle",
//         children: [new H1(group.title)],
//       },
//       {
//         id: "collectionDescription",
//         children: [
//           {
//             if: group.description !== undefined,
//             id: "collectionDescriptionText",
//             textContent: group.description,
//           },
//         ],
//       },
//       {
//         class: `groupPosts ${displayStyle}`,
//         children: generateGroupPosts(group.posts, displayStyle, accessKeys),
//       },
//     ],
//   };
// };
