import Board from "./board.js";
import Controls from "./controls.js";
import Renderer from "./renderer.js";
import Shape from "./shape.js";

class Gui {
  constructor() {
    const canvasElement = document.querySelector("canvas");
    this.board = new Board(new Shape("square"), 5, 5);
    this.controls = new Controls(this.board);
    this.renderer = new Renderer(canvasElement, this.board);
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
