import { AudioType } from "./types.mjs";

export class Audio {
  static play(audioType: AudioType) {
    const audioToPlay = document.querySelector(
      "audio#" + audioType
    ) as HTMLAudioElement;
    audioToPlay.play();
  }
}
