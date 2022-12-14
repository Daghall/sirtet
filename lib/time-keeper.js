import Emitter from "./emitter.js";

export default class TimeKeeper extends Emitter {
  #ttl;
  #timeLeft;

  constructor(board, ttl = 5000) {
    super();
    this.#ttl = ttl;
    this.#timeLeft = ttl;

    board.on("level up", () => {
      this.#ttl -= 200;
      this.reset();
    });
  }

  update(time) {
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
}
