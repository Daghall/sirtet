export default class SoundEffects {
  #context;

  constructor(board) {
    this.board = board;
    this.#context = new AudioContext();
    this.#addListeners();
  }

  #addListeners() {
    this.board.on("explode", () => {
      this.#playNote({ frequency: 20, type: SoundEffects.TYPES.TRIANGLE, duration: 0.2, gain: 1 });
    });
    this.board.on("good punch", () => {
      this.#playNote({ frequency: 20, type: SoundEffects.TYPES.TRIANGLE, duration: 0.2, gain: 1 });
      this.#playNote({ frequency: 30, type: SoundEffects.TYPES.SINE, duration: 0.1, gain: 1 });
    });
    this.board.on("bad punch", () => {
      this.#playNote({ frequency: 90, type: SoundEffects.TYPES.SQUARE, duration: 0.05 });
      this.#playNote({ frequency: 70, type: SoundEffects.TYPES.SQUARE, startTime: 0.05, duration: 0.05 });
      this.#playNote({ frequency: 50, type: SoundEffects.TYPES.SQUARE, startTime: 0.1, duration: 0.05 });
    });
    this.board.on("line cleared", () => {
      this.#playNote({ frequency: 150, type: SoundEffects.TYPES.SINE, startTime: 0.2, duration: 0.05 });
      this.#playNote({ frequency: 250, type: SoundEffects.TYPES.SINE, startTime: 0.25, duration: 0.05 });
      this.#playNote({ frequency: 400, type: SoundEffects.TYPES.SINE, startTime: 0.3, duration: 0.1 });
    });
    this.board.on("good swap", () => {
      this.#playSwap();
    });
    this.board.on("bad swap", () => {
      this.#playNote({ frequency: 80, type: SoundEffects.TYPES.TRIANGLE, duration: 0.05 });
    });
    this.board.on("rotate", () => {
      this.#playNote({ frequency: 1600, type: SoundEffects.TYPES.SINE, duration: 0.01 });
      this.#playNote({ frequency: 1300, type: SoundEffects.TYPES.SINE, startTime: 0.0025, duration: 0.01 });
    });
    this.board.on("countdown", () => {
      this.#playNote({ frequency: 500, type: SoundEffects.TYPES.SQUARE, startTime: 0, duration: 0.15, gain: 0.01 });
      this.#playNote({ frequency: 490, type: SoundEffects.TYPES.SINE, startTime: 0, duration: 0.15, gain: 0.01 });
    });
    this.board.on("countdown finished", () => {
      this.#playNote({ frequency: 1000, type: SoundEffects.TYPES.SQUARE, duration: 0.35, gain: 0.01 });
      this.#playNote({ frequency: 990, type: SoundEffects.TYPES.SUARE, duration: 0.35, gain: 0.01 });
    });
  }

  #playSwap() {
    const bufferSize = this.#context.sampleRate * 0.045;
    const buffer = new AudioBuffer({ length: bufferSize, sampleRate: this.#context.sampleRate, numberOfChannels: 1 });
    const bufferData = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; ++i) {
      bufferData[i] = (Math.random() * 2 - 1) * (i / bufferSize);
    }

    const bufferSource = new AudioBufferSourceNode(this.#context, { buffer });
    const lowpassFilter = new BiquadFilterNode(this.#context, { type: "lowpass", frequency: 500 });
    const highpassFilter = new BiquadFilterNode(this.#context, { type: "highpass", frequency: 1200 });

    bufferSource.connect(lowpassFilter).connect(highpassFilter).connect(this.#context.destination);
    bufferSource.start(this.#context.currentTime);
  }

  #playNote({ frequency, type = SoundEffects.TYPES.SINE, duration = 0, startTime = 0, gain = 0.05 }) {
    const oscillator = new OscillatorNode(this.#context);
    const gainNode = new GainNode(this.#context, { gain });

    oscillator.connect(gainNode).connect(this.#context.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start(this.#context.currentTime + startTime);
    oscillator.stop(this.#context.currentTime + startTime + duration);
  }

  static TYPES = {
    SINE: "sine",
    SQUARE: "square",
    SAWTOOTH: "sawtooth",
    TRIANGLE: "triangle",
  };
}
