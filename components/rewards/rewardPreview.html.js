// // elements
// import { H3 } from "../../elements/headings/headings.html.js";
// import { Img } from "../../elements/img/img.html.js";
// import { P } from "../../elements/p/p.html.js";

// // components
// import { BtnContainer } from "../btn/btn.html.js";
// import { Card } from "../card/card.html.js";
// import { Icon } from "../icon/icon.html.js";

// // modules
// import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";
// import { formatDateOrDaysAgo } from "../../modules/formatDate/formatDate.js";

// const generateRewards = (post, accessKeys) => {
//   const rewardsList = [],
//     rewards = post.rewards || [];

//   // check to see if the user has access to the reward
//   rewards.forEach((reward) => {
//     if (reward.accessGranted) {
//       rewardsList.push({
//         class: "reward",
//         children: [
//           {
//             class: "icon-container",
//             child: new Icon(reward.type),
//           },
//           new P(reward.title),
//           new BtnContainer(
//             {
//               class: "sm",
//               href: `/premium/post/${post._id}`,
//               textContent: "View Post",
//             },
//             "minimal"
//           ),
//         ],
//       });
//     } else {
//       let patreonName = "Patreon",
//         patreonUrl = "";

//       accessKeys.forEach((key) => {
//         if (key.value == post.access_key) {
//           patreonName = key.name;
//           patreonUrl = key.url;
//         }
//       });

//       const noAccessBtn = reward.noAccessKey
//         ? {
//             class: "sm accent",
//             textContent: `Join the ${patreonName} to Unlock for ${formatCents(
//               reward.price
//             )}`,
//             href: patreonUrl,
//             target: "+blank",
//           }
//         : {
//             class: "sm accent",
//             textContent: `Post Unlocked at ${formatCents(reward.price)}`,
//             href: "/premium/pledge",
//           };

//       rewardsList.push({
//         class: "reward locked",
//         children: [
//           {
//             class: "icon-container",
//             child: new Icon(reward.type),
//           },
//           new P(reward.title),
//           new BtnContainer(noAccessBtn, "minimal"),
//         ],
//       });
//     }
//   });

//   return rewardsList;
// };

// export const REWARDPREVIEW = (post, accessKeys) => {
//   return Card({
//     className: "postPreview",
//     body: {
//       children: [
//         {
//           class: "info",
//           children: [
//             {
//               if: post.preview_src !== undefined,
//               class: "previewImage",
//               child: new Img({
//                 src: post.preview_src,
//                 alt: post.preview_alt,
//               }),
//             },
//             {
//               class: "titleAndDate",
//               children: [
//                 new H3(post.title),
//                 new P({
//                   class: "date",
//                   textContent: formatDateOrDaysAgo(post.published),
//                 }),
//               ],
//             },
//           ],
//         },
//         {
//           class: "descriptionAndRewards",
//           children: [
//             {
//               class: "description",
//               innerHTML: post.description,
//             },
//             {
//               class: "rewards",
//               children: generateRewards(post, accessKeys),
//             },
//           ],
//         },
//       ],
//     },
//   });
// };
