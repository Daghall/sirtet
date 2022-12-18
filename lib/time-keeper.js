import Emitter from "./emitter.js";

export default class TimeKeeper extends Emitter {
  #board;
  #ttl;
  #timeLeft;
  #timePlayed;

  constructor(board, ttl = 5000) {
    super();
    this.#ttl = ttl;
    this.#timeLeft = ttl;
    this.#timePlayed = 0;
    this.#board = board;

    board.on("level up", () => {
      this.#ttl -= 200;
      this.reset();
    });
  }

  update(time) {
    if (!this.#board.isPlaying()) return;

    this.#timePlayed += time;
    this.#timeLeft -= time;
    if (this.#timeLeft < 0) {
      this.emit("timeout");
      this.reset();
    }
  }

  reset() {
    this.#timeLeft = this.#ttl;
  }

  getProgress() {
    return this.#timeLeft / this.#ttl;
  }

  getPlayTime() {
    return this.#timePlayed;
  }
}
