export default class Controls {
  constructor(board) {
    this.board = board;
    this.setUpListeners();
  }

  setUpListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "j":
        case "ArrowDown":
          this.board.moveDown();
          break;
        case "k":
        case "ArrowUp":
          this.board.moveUp();
          break;
        default:
          console.log("Unbound key pressed", { event }); // eslint-disable-line no-console
      }
    });
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
