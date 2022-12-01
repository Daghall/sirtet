export default class Renderer {
  constructor(canvasElement, board) {
    this.canvas = canvasElement.getContext("2d");
    this.board = board;
    this.settings = {
      width: canvasElement.width,
      height: canvasElement.height,
      start: {
        x: 100,
        y: 50,
      },
      blockSize: 15,
      padding: 3,
    };
  }

  render() {
    this.clearCanvas();
    this.renderBoard();
    this.renderShape();
  }

  renderBoard() {
    const {
      start,
      blockSize,
      padding,
    } = this.settings;

    this.canvas.strokeStyle = "gray";
    this.canvas.fillStyle = "gray";
    for (let x = 0; x <= this.board.constructor.MAX_X; ++x) {
      for (let y = 0; y <= this.board.constructor.MAX_Y; ++y) {
        this.canvas.beginPath();
        const left = start.x + x * (blockSize + padding);
        const top = start.y + y * (blockSize + padding);
        this.canvas.rect(left, top, blockSize, blockSize);
        if (this.board.blocks[x][y] === 1) {
          this.canvas.fill();
        } else {
          this.canvas.stroke();
        }
      }
    }
  }

  renderShape() {
    const {
      start,
      blockSize,
      padding,
    } = this.settings;

    this.board.die.shape.forEach(({ x, y }) => {
      const left = start.x + x * (blockSize + padding);
      const top = start.y + y * (blockSize + padding);
      this.canvas.beginPath();
      this.canvas.rect(left, top, blockSize, blockSize);

      if (this.board.blocks[x][y] === 1) {
        this.canvas.fillStyle = "limegreen";
      } else {
        this.canvas.fillStyle = "red";
      }
      this.canvas.fill();
    });
  }

  clearCanvas() {
    const { width, height } = this.settings;
    this.canvas.clearRect(0, 0, width, height);
  }
}
