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
  SWIPE_RIGHT: '/sounds/swipe_right.mp3', // Magic wand
  SWIPE_LEFT: '/sounds/swipe_left.mp3', // Whoosh
  REACTION: '/sounds/reaction.mp3', // Pop
  POST_SUCCESS: '/sounds/post_success.mp3', // Success chime
  MESSAGE_SENT: '/sounds/messege_sent.mp3', // Swoosh
};
