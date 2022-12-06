export default class ScoreKeeper {
  #board;
  #buffered;
  #score;
  #stats;

  constructor(board) {
    this.#board = board;
    this.#buffered = 0;
    this.#score = 0;
    this.#stats = {
      ones: 0,
      twos: 0,
      threes: 0,
      fours: 0,
      fullClears: 0,
    };
    this.#addListeners();
  }

  update(time) {
    if (this.#buffered > 0) {
      const toBank = Math.ceil(this.#buffered * time / 100);
      this.#score += toBank;
      this.#buffered -= toBank;
    }
  }

  getBuffered() {
    return this.#buffered;
  }

  getScore() {
    return this.#score;
  }

  getStats() {
    return { ...this.#stats };
  }

  #addListeners() {
    this.#board.on("line cleared", (linesCleared) => {
      this.#buffered += this.#getScoreFromLines(linesCleared);
      ++this.#stats[ScoreKeeper.#STATS[linesCleared]];
    });

    this.#board.on("full clear", () => {
      this.#buffered += 1000;
      ++this.#stats.fullClears;
    });
  }

  #getScoreFromLines(linesCleared) {
    switch (linesCleared) {
      case 1: return 100;
      case 2: return 250;
      case 3: return 400;
      case 4: return 600;
    }
  }

  static #STATS = {
    1: "ones",
    2: "twos",
    3: "threes",
    4: "fours",
  };
}
