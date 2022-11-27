import Shape from "./shape.js";

export default class Board {
  constructor(current, x = 0, y = 0) {
    this.current = current || Shape.randomShape();
    this.current.setBoard(Board);
    this.current.moveTo(x, y);
  }

  moveUp() {
    this.current.up();
  }

  moveDown() {
    this.current.down();
  }

  moveLeft() {
  }

  moveRight() {
  }

  drop() {
  }

  rotateClockwise() {
  }

  rotateCounterClockwise() {
  }

  static MAX_Y = 40 - 1;
  static MAX_X = 10 - 1;
}
