import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";
import { BtnContainer } from "../btn/btn.html.js";
import { EmbeddedYouTubeVideo } from "../embeddedYouTubeVideo/embeddedYouTubeVideo.html.js";

export const ATTACHMENTACCESS = (user, post, accessKeys = []) => {
  const rewardsList = [],
    rewards = post.rewards || [];

  const randomMemeVideo = () => {
    const memeVideos = [
      "https://www.youtube.com/embed/dQw4w9WgXcQ?si=gN-i8rcy75QmxumF",
      "https://www.youtube.com/embed/ag9wNDyzlN8?si=5EFLjFYHVuOyJ-kM",
      "https://www.youtube.com/embed/qItugh-fFgg?si=onbAnKnAHbzhVXqw",
    ];
    return memeVideos[Math.floor(Math.random() * memeVideos.length)];
  };

  const generateReward = (reward) => {
    const noAccessBtnMarkup = reward.noAccessKey
        ? {
            class: "accent",
            textContent: `Join the ${patreonName} to Unlock for ${formatCents(
              reward.price
            )}`,
            href: patreonUrl,
            target: "_blank",
          }
        : {
            class: "accent",
            textContent: `Post Unlocked at ${formatCents(reward.price)}`,
            href: patreonUrl,
          },
      noAccessBtn = new BtnContainer(noAccessBtnMarkup, "minimal");

    if (reward.type === "video") {
      if (reward.accessGranted) {
        return EmbeddedYouTubeVideo(reward.url);
      } else {
        return {
          class: "restrictedVideo",
          children: [noAccessBtn, EmbeddedYouTubeVideo(randomMemeVideo())],
        };
      }
    } else if (reward.type === "file" || reward.type === "googleDriveFile") {
      if (reward.accessGranted) {
        return new BtnContainer({
          href: `/premiumAccess/${user._id}/${post._id}/${reward._id}`,
          textContent: `Download ${reward.title}`,
        });
      } else {
        return new BtnContainer(noAccessBtnMarkup);
      }
    }
  };

  const rewardBlock = (reward) => {
    return {
      class: `reward ${reward.type}`,
      child: generateReward(reward),
    };
  };

  let patreonName = "Patreon",
    patreonUrl = "";

  accessKeys.forEach((key) => {
    if (key.value == post.access_key) {
      patreonName = key.name;
      patreonUrl = key.url;
    }
  });

  // render the rewards
  rewards.forEach((reward) => {
    rewardsList.push(rewardBlock(reward));
  });

  return {
    id: "rewardAccess",
    children: rewardsList,
  };
};
