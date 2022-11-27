export default class Controls {
  constructor(board) {
    this.board = board;
    this.setUpListeners();
  }

  setUpListeners() {

  }

  up() {
    this.board.moveUp();
  }

  down() {
    this.board.moveDown();
  }

  left() {
    this.board.moveLeft();
  }

  right() {
    this.board.moveRight();
  }

  drop() {
    this.board.moveDrop();
  }

  rotateClockwise() {
    this.board.rotateClockwise();
  }

  rotateCounterClockwise() {
    this.board.rotateCounterClockwise();
  }
}
