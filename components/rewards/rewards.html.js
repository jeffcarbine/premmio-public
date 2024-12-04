// import { AuthorizingPatreon, PatreonAuth } from "../user/patreonAuth.html.js";
// import { SelectTier } from "../user/selectTier.html.js";
// import { SignUp } from "../user/signUp.html.js";
// import { LATESTREWARDS } from "./latestPosts.html.js";
// import { REWARDGROUPS } from "./collections.html.js";

// export const REWARDS = (data, patreon = false, accessKeys = []) => {
//   const user = data.user,
//     query = data.query;

//   // render different things depending on the user's info
//   if (user && user.username !== undefined) {
//     return {
//       id: "posts",
//       children: [LATESTREWARDS(accessKeys), REWARDGROUPS()],
//     };
//   } else {
//     if (patreon) {
//       // if there is a code in the query, render the patreon auth component
//       if (query.code) {
//         return AuthorizingPatreon(query.code);
//       } else {
//         return PatreonAuth();
//       }
//     } else {
//       return SignUp();
//     }
//   }
// };
