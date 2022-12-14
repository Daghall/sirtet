export default class Controls {
  #board;

  constructor(board) {
    this.#board = board;
    this.#setUpListeners();
  }

  #setUpListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "j":
        case "ArrowDown":
          this.down();
          break;
        case "k":
        case "ArrowUp":
          this.up();
          break;
        case "h":
        case "ArrowLeft":
          this.left();
          break;
        case "l":
        case "ArrowRight":
          this.right();
          break;
        case "a":
          this.rotateCounterClockwise();
          break;
        case "f":
          this.rotateClockwise();
          break;
        case "d":
          this.punch();
          break;
        case "s":
          this.swapShape();
          break;
        default:
          console.log("Unbound key pressed", { event }); // eslint-disable-line no-console
      }
    });
  }

  up() {
    this.#board.moveUp();
  }

  down() {
    this.#board.moveDown();
  }

  left() {
    this.#board.moveLeft();
  }

  right() {
    this.#board.moveRight();
  }

  punch() {
    this.#board.punch();
  }

  swapShape() {
    this.#board.swapShape();
  }

  rotateClockwise() {
    this.#board.rotateClockwise();
  }

  rotateCounterClockwise() {
    this.#board.rotateCounterClockwise();
  }
}
