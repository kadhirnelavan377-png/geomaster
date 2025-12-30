
class AudioManager {
  private clickSound: HTMLAudioElement;

  constructor() {
    this.clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    this.clickSound.volume = 0.3;
  }

  playClick() {
    const sound = this.clickSound.cloneNode() as HTMLAudioElement;
    sound.play().catch(() => {});
  }
}

export const audio = new AudioManager();
