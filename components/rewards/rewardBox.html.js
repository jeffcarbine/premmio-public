// import { A } from "../../elements/a/a.html.js";
// import { H2 } from "../../elements/headings/headings.html.js";
// import { P } from "../../elements/p/p.html.js";

// import { formatDateOrDaysAgo } from "../../modules/formatDate/formatDate.js";
// import { ResponsiveImg } from "../responsiveImg/responsiveImg.html.js";

// const generatePostBoxImageData = (post) => {
//   const data = {
//     src: post.src,
//     alt: post.alt,
//   };

//   const sizes = ["src_xs", "src_sm", "src_md", "src_lg"];

//   sizes.forEach((size) => {
//     if (post[size] !== undefined) {
//       data[size] = post[size];
//     }
//   });

//   return data;
// };

// export const REWARDBOX = (post) => {
//   return new A({
//     href: `/premium/post/${post.localpath}`,
//     class: "postBox",
//     "data-tags": post.tags.join(" "),
//     children: [
//       {
//         class: "info",
//         children: [
//           {
//             if: post.src !== undefined,
//             class: "previewImage",
//             child: new ResponsiveImg(generatePostBoxImageData(post)),
//           },
//           {
//             class: "titleAndDate",
//             children: [
//               new H2(post.title),
//               new P({
//                 class: "date",
//                 textContent: formatDateOrDaysAgo(post.published),
//               }),
//             ],
//           },
//         ],
//       },
//       // {
//       //   class: "description",
//       //   children: [
//       //     {
//       //       class: "description",
//       //       innerHTML: post.description,
//       //     },
//       //   ],
//       // },
//     ],
//   });
// };
