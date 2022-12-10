import Emitter from "./emitter.js";

export default class ScoreKeeper extends Emitter {
  #board;
  #buffered;
  #score;
  #stats;
  #highScores;

  constructor(board, highScores = []) {
    super();
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
    this.#highScores = highScores;
    this.#addListeners();
  }

  update(time) {
    if (this.#buffered > 0) {
      const toBank = Math.ceil(this.#buffered * time / 100);
      this.#score += Math.min(toBank, this.#buffered);
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

    this.#board.on("death", () => {
      this.#addHighScore();
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

  #addHighScore() {
    this.#highScores.push({
      date: Date.now(),
      score: this.getScore(),
    });

    this.#highScores.sort((a, b) => {
      if (a.score === b.score) {
        return b.date - a.date;
      }

      return b.score - a.score;
    });

    while (this.#highScores.length > 10) {
      this.#highScores.pop();
    }

    this.emit("high score added", this.#highScores.slice());
  }

  getHighScores() {
    let previousScore;
    let previousPlace = 1;
    return this.#highScores.map(({ score, date }, index) => {
      let place;
      if (score !== previousScore) {
        place = index + 1;
        previousPlace = place;
      } else {
        place = previousPlace;
      }

      previousScore = score;

      return {
        place,
        score,
        date,
      };
    });
  }

  isNewHighScore() {
    return this.#score === this.#highScores[0].score;
  }

  static #STATS = {
    1: "ones",
    2: "twos",
    3: "threes",
    4: "fours",
  };
}
