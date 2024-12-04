// Modules
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

/**
 * Converts a number of seconds into a time code string (e.g., 128 seconds to "2:08").
 *
 * @param {number} num - The number of seconds.
 * @returns {string} The formatted time code.
 */
const getTimeCodeFromNum = (num) => {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
};

/**
 * Finds the audio element within the closest .audioPlayer ancestor.
 *
 * @param {HTMLElement} element - The element to start the search from.
 * @returns {HTMLAudioElement} The found audio element.
 */
const findAudio = (element) => {
  const audioPlayer = element.closest(".audioPlayer"),
    audio = audioPlayer.querySelector("audio");

  return audio;
};

/**
 * Toggles play/pause for the audio element.
 *
 * @param {HTMLElement} button - The button element that triggers the play/pause.
 */
const play = (button) => {
  // find the audio element
  const audio = findAudio(button);

  const playPause = () => {
    if (audio.paused) {
      button.classList.remove("play");
      button.classList.add("pause");
      audio.play();
    } else {
      button.classList.remove("pause");
      button.classList.add("play");
      audio.pause();
    }
  };

  if (audio.src === "") {
    // then the audio hasn't been loaded yet
    loadAudio(audio);

    playPause();
  } else {
    // then the audio has been loaded and we can
    // proceed with play/pause functionality
    playPause();
  }
};

addEventDelegate("click", ".audioPlayer .toggle-play", play);

/**
 * Loads the audio source and sets up event listeners.
 *
 * @param {HTMLAudioElement} audio - The audio element to load.
 */
const loadAudio = (audio) => {
  const src = audio.dataset.src;
  audio.src = src;

  audio.addEventListener(
    "loadeddata",
    () => {
      const audioPlayer = audio.parentNode;
      let duration = audio.duration;

      if (!isFinite(duration)) {
        // Re-check the duration after a short delay
        setTimeout(() => {
          duration = audio.duration;

          if (isFinite(duration)) {
            audioPlayer.querySelector(".time .length").textContent =
              getTimeCodeFromNum(duration);
          } else {
            audioPlayer.querySelector(".time .length").textContent = "Live";
          }
        }, 500); // Adjust the delay as needed
      } else {
        audioPlayer.querySelector(".time .length").textContent =
          getTimeCodeFromNum(duration);
      }

      audioPlayer.querySelector(".time .current").textContent = "0:00";
      audio.volume = 0.75;
    },
    false
  );

  setInterval(() => {
    monitorProgress(audio);
  }, 500);
};

/**
 * Scrubs the audio to a specific time based on the timeline click.
 *
 * @param {HTMLElement} timeline - The timeline element.
 * @param {MouseEvent} e - The mouse event.
 */
const scrub = (timeline, e) => {
  const audio = findAudio(timeline);

  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
  audio.currentTime = timeToSeek;
};

addEventDelegate("click", ".audioPlayer .timeline", scrub);

/**
 * Monitors the progress of the audio and updates the progress bar and current time.
 *
 * @param {HTMLAudioElement} audio - The audio element to monitor.
 */
const monitorProgress = (audio) => {
  const audioPlayer = audio.parentNode;

  const progressBar = audioPlayer.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
};

// const muteUnmute = (button) => {
//   const audio = findAudio(button);

//   audio.muted = !audio.muted;

//   if (audio.muted) {
//     button.classList.add("mute");
//   } else {
//     button.classList.remove("mute");
//   }
// };

// addEventDelegate("click", ".audioPlayer .volume-button", muteUnmute);

/**
 * Toggles the visibility of the volume slider.
 *
 * @param {HTMLElement} volumeButton - The button element that triggers the volume slider.
 */
const toggleVolumeSlider = (volumeButton) => {
  const volumeContainer = volumeButton.parentNode;

  if (volumeContainer.classList.contains("active")) {
    volumeContainer.classList.remove("active");
  } else {
    volumeContainer.classList.add("active");
  }
};

addEventDelegate(
  "click",
  ".audioPlayer .controls .volume-button",
  toggleVolumeSlider
);

/**
 * Adjusts the volume of the audio based on the volume slider click.
 *
 * @param {HTMLElement} volumeSlider - The volume slider element.
 * @param {MouseEvent} e - The mouse event.
 */
const adjustVolume = (volumeSlider, e) => {
  const audio = findAudio(volumeSlider),
    audioPlayer = audio.parentNode;

  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width =
    newVolume * 100 + "%";
};

addEventDelegate(
  "click",
  ".audioPlayer .controls .volume-slider",
  adjustVolume
);
