export class AudioManager {
  private static instance: AudioManager;
  private context: AudioContext;
  private gainNode: GainNode;
  private soundCache: Map<string, AudioBuffer> = new Map();
  private currentSource: AudioBufferSourceNode | null = null;

  private constructor() {
    this.context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);

    const buffer = this.context.createBuffer(1, 1, 22050);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gainNode);
    source.start(0);
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  playSound(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let buffer = this.soundCache.get(url);

          if (!buffer) {
            buffer = await this.loadSound(url);
            this.soundCache.set(url, buffer);
          }

          // Останавливаем текущий звук, если он есть
          if (this.currentSource) {
            this.currentSource.stop();
          }

          const source = this.context.createBufferSource();
          this.currentSource = source;
          source.buffer = buffer;
          source.connect(this.gainNode);

          // Отслеживаем окончание воспроизведения
          source.onended = () => {
            this.currentSource = null;
            resolve();
          };

          source.start(0);
        } catch (error) {
          console.error("Failed to play sound:", error);
          reject(error);
        }
      })();
    });
  }

  stop() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
  }

  private async loadSound(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.context.decodeAudioData(arrayBuffer);
  }

  setVolume(value: number) {
    this.gainNode.gain.value = value;
  }
}
