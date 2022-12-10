import Board from "./board.js";
import Controls from "./controls.js";
import Renderer from "./renderer.js";
import ScoreKeeper from "./score-keeper.js";
import SoundEffects from "./sound-effects.js";

class Gui {
  constructor() {
    const canvasElement = document.querySelector("canvas");
    this.board = new Board();
    this.board.die.moveTo(5, this.board.maxY - 2);
    this.controls = new Controls(this.board);
    this.scoreKeeper = new ScoreKeeper(this.board, Gui.#getHighScoresFromLocalStorage());
    this.renderer = new Renderer(canvasElement, this.board, this.scoreKeeper);
    this.soundEffects = new SoundEffects(this.board);

    this.scoreKeeper.on("high score added", Gui.setHighScoresInLocalStorage);
  }

  draw() {
    window.requestAnimationFrame((time) => {
      this.renderer.render(time);
      window.requestAnimationFrame(this.draw.bind(this));
    });
  }

  static #getHighScoresFromLocalStorage() {
    return JSON.parse(localStorage.getItem(Gui.#highScoreLocalStorageName)) || [];
  }

  static setHighScoresInLocalStorage(highScores) {
    return localStorage.setItem(
      Gui.#highScoreLocalStorageName,
      JSON.stringify(highScores)
    );
  }

  static #highScoreLocalStorageName = "sirtet-highscores";
}

function init() {
  const gui = new Gui();
  gui.draw();
}

init();
