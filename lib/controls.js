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
        case "h":
        case "ArrowLeft":
          this.board.moveLeft();
          break;
        case "l":
        case "ArrowRight":
          this.board.moveRight();
          break;
        case "a":
          this.board.rotateCounterClockwise();
          break;
        case "f":
          this.board.rotateClockwise();
          break;
        case "d":
          this.board.drop();
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
    this.board.drop();
  }

  rotateClockwise() {
    this.board.rotateClockwise();
  }

  rotateCounterClockwise() {
    this.board.rotateCounterClockwise();
  }
}
