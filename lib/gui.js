import Board from "./board.js";
import Controls from "./controls.js";
import Renderer from "./renderer.js";
import SoundEffects from "./sound-effects.js";

class Gui {
  constructor() {
    const canvasElement = document.querySelector("canvas");
    this.board = new Board();
    this.board.die.moveTo(5, this.board.maxY - 2);
    this.controls = new Controls(this.board);
    this.renderer = new Renderer(canvasElement, this.board);
    this.soundEffects = new SoundEffects(this.board);
  }

  draw() {
    window.requestAnimationFrame((time) => {
      this.renderer.render(time);
      window.requestAnimationFrame(this.draw.bind(this));
    });
  }
}

function init() {
  const gui = new Gui();
  gui.draw();
}

init();
