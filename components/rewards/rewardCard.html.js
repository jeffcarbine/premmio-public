// import { H2 } from "../../elements/headings/headings.html.js";
// import { formatDateOrDaysAgo } from "../../modules/formatDate/formatDate.js";
// import { Card } from "../card/card.html.js";

// export const REWARDCard = (post) => {
//   const cardData = {
//     heading: new H2(post.title),
//     subheading: formatDateOrDaysAgo(post.published),
//     body: {
//       innerHTML: post.description,
//     },
//     actions: [
//       {
//         textContent: "View Post",
//         href: `/premium/post/${post.localpath}`,
//       },
//     ],
//   };

//   if (post.src) {
//     const image = {
//       src: post.src,
//       alt: post.title,
//     };

//     // possible image sizes
//     const sizes = ["src_xs", "src_sm", "src_md", "src_lg"];

//     sizes.forEach((size) => {
//       if (post[size]) {
//         image[size] = post[size];
//       }
//     });

//     cardData.image = image;
//   }

//   return Card(cardData);
// };
