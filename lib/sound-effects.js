export default class SoundEffects {
  #context;

  constructor(board) {
    this.board = board;
    this.#context = new AudioContext();
    this.#addListeners();
  }

  #addListeners() {
    this.board.on("explode", () => {
      this.#playNote({ frequency: 20, type: "triangle", endTime: 0.2, gain: 1 });
    });
    this.board.on("good punch", () => {
      this.#playNote({ frequency: 20, type: "triangle", endTime: 0.2, gain: 1 });
      this.#playNote({ frequency: 30, type: "sine", endTime: 0.1, gain: 1 });
    });
    this.board.on("bad punch", () => {
      this.#playNote({ frequency: 90, type: "square", endTime: 0.05 });
      this.#playNote({ frequency: 70, type: "square", startTime: 0.05, endTime: 0.05 });
      this.#playNote({ frequency: 50, type: "square", startTime: 0.1, endTime: 0.05 });
    });
    this.board.on("line cleared", () => {
      this.#playNote({ frequency: 150, type: "sine", startTime: 0.2, endTime: 0.05 });
      this.#playNote({ frequency: 250, type: "sine", startTime: 0.25, endTime: 0.05 });
      this.#playNote({ frequency: 350, type: "sine", startTime: 0.3, endTime: 0.1 });
    });
    this.board.on("good swap", () => {
      this.#playSwap();
    });
    this.board.on("bad swap", () => {
      this.#playNote({ frequency: 80, type: "triangle", endTime: 0.05 });
    });
    this.board.on("rotate", () => {
      this.#playNote({ frequency: 1600, type: "sine", endTime: 0.005 });
      this.#playNote({ frequency: 1300, type: "sine", startTime: 0.0025, endTime: 0.005 });
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

  #playNote({ frequency, type = "sine", endTime = 0, startTime = 0, gain = 0.05 }) {
    const oscillator = new OscillatorNode(this.#context);
    const gainNode = new GainNode(this.#context, { gain });

    oscillator.connect(gainNode).connect(this.#context.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start(this.#context.currentTime + startTime);
    oscillator.stop(this.#context.currentTime + startTime + endTime);
  }
}
