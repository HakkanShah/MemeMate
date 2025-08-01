// @ts-nocheck
"use client";

// A simple utility to play sounds in the browser.
// This helps avoid creating new Audio objects repeatedly.
const audioCache: { [key: string]: HTMLAudioElement } = {};

export function playSound(src: string, volume: number = 0.5) {
  if (typeof window === 'undefined') return;

  try {
    let audio = audioCache[src];
    if (!audio) {
      audio = new Audio(src);
      audio.volume = volume;
      audioCache[src] = audio;
    }
    
    // Allows playing the sound again before it has finished.
    audio.currentTime = 0;
    audio.play().catch(error => {
      // Autoplay was prevented. This is a common browser policy.
      // We can ignore this error as it's not critical for functionality.
    });

  } catch (error) {
    console.error("Could not play sound:", error);
  }
}

export const SOUNDS = {
  SWIPE_RIGHT: 'https://pixabay.com/sound-effects/correct-6033/', // Magic wand
  SWIPE_LEFT: 'https://pixabay.com/sound-effects/simple-whoosh-382724/', // Whoosh
  REACTION: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3b9c03830.mp3', // Pop
  POST_SUCCESS: 'https://cdn.pixabay.com/audio/2022/11/17/audio_84f9b846f3.mp3', // Success chime
  MESSAGE_SENT: 'https://cdn.pixabay.com/audio/2022/03/15/audio_ad4cc3e280.mp3', // Swoosh
};
