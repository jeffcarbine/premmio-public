// import { H1 } from "../../elements/headings/headings.html.js";
// import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";

// const rewardBlock = (reward) => {
//   return {
//     class: `reward ${reward.type}`,
//   };
// };

// export const REWARD = (postData, user, accessKeys = []) => {
//   const generateRewards = (post) => {
//     const rewardsList = [],
//       rewards = post.rewards;

//     // check to see if the user has access to the reward
//     rewards.forEach((reward) => {
//       if (reward.accessGranted) {
//         rewardsList.push(rewardBlock(reward));

//         // rewardsList.push({
//         //   class: "reward",
//         //   children: [
//         //     {
//         //       class: "icon-container",
//         //       child: new Icon(reward.type),
//         //     },
//         //     new P(reward.title),
//         //     new BtnContainer(
//         //       {
//         //         class: "sm",
//         //         href: `/pras/${user._id}/${post._id}`,
//         //         textContent: "View Post",
//         //       },
//         //       "minimal"
//         //     ),
//         //   ],
//         // });
//       } else {
//         let patreonName = "Patreon",
//           patreonUrl = "";

//         accessKeys.forEach((key) => {
//           if (key.value == post.access_key) {
//             patreonName = key.name;
//             patreonUrl = key.url;
//           }
//         });

//         const noAccessBtn = reward.noAccessKey
//           ? {
//               class: "sm accent",
//               textContent: `Join the ${patreonName} to Unlock for ${formatCents(
//                 reward.price
//               )}`,
//               href: patreonUrl,
//               target: "+blank",
//             }
//           : {
//               class: "sm accent",
//               textContent: `Post Unlocked at ${formatCents(reward.price)}`,
//               href: "/premium/pledge",
//             };

//         rewardsList.push({
//           // render a different block depending on the reward type
//           //
//           // class: "reward locked",
//           // children: [
//           //   {
//           //     class: "icon-container",
//           //     child: new Icon(reward.type),
//           //   },
//           //   new P(reward.title),
//           //   new BtnContainer(noAccessBtn, "minimal"),
//           // ],
//         });
//       }
//     });

//     return rewardsList;
//   };

//   return {
//     id: "post",
//     children: [
//       new H1(postData.title),
//       {
//         class: "description",
//         innerHTML: postData.description,
//       },
//       {
//         class: "rewards",
//         children: generateRewards(postData),
//       },
//     ],
//   };
// };
