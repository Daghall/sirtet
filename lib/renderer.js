import Block from "./block.js";
import Particle from "./particle.js";
import Shape from "./shape.js";

export default class Renderer {
  constructor(canvasElement, board) {
    this.canvas = canvasElement.getContext("2d");
    this.board = board;
    this.particles = [];
    this.settings = {
      width: canvasElement.width,
      height: canvasElement.height,
      holdStart: {
        x: 30,
        y: 40,
      },
      boardStart: {
        x: 125,
        y: 40,
      },
      blockSize: 15,
      padding: 3,
    };

    this.board.on("punch", (event) => {
      this.addParticles(event);
    });
  }

  render(time) {
    const elapsedTime = time - this.previousTime;
    this.clearCanvas();
    this.renderBoard();
    this.renderShape();
    this.renderHold();
    this.renderParticles(elapsedTime);
    this.previousTime = time;
  }

  renderBoard() {
    const { boardStart: start, blockSize, padding } = this.settings;

    // TODO: Break out colors
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
    const { boardStart: start, blockSize, padding } = this.settings;

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

  renderHold() {
    const { holdStart: start, blockSize, padding } = this.settings;

    const boxSize = (blockSize * 4 + padding * 5);

    // Border
    this.canvas.beginPath();
    this.canvas.strokeStyle = "gray";
    this.canvas.rect(start.x, start.y, boxSize, boxSize);
    this.canvas.stroke();

    // Text
    this.canvas.font = "bold 12px Arial";
    this.canvas.textAlign = "center";
    this.canvas.fillStyle = "gray";
    this.canvas.fillText("HOLD", start.x + boxSize / 2, start.y - 10);

    // Shape
    if (this.board.hold) {
      this.canvas.beginPath();
      this.canvas.fillStyle = "gray";
      const shapeName = this.board.hold.name;
      const shapeOffset = this.getShapeOffsets(shapeName);
      const startX = start.x + shapeOffset.x * (blockSize + padding) + padding;
      const startY = start.y + shapeOffset.y * (blockSize + padding) + padding;

      Shape.ROTAION_STATES[shapeName][0].forEach(({ x, y }) => {
        const left = startX + x * (blockSize + padding);
        const top = startY + y * (blockSize + padding);
        this.canvas.rect(left, top, blockSize, blockSize);
        this.canvas.fill();
      });
    }
  }

  renderParticles(elapsedTime) {
    const { blockSize } = this.settings;

    this.particles.forEach((particle) => {
      this.canvas.beginPath();
      const { x, y, size, rotation } = particle;
      const particleSize = size * blockSize;
      const particleCenter = {
        x: x + particleSize / 2,
        y: y + particleSize / 2,
      };
      this.canvas.translate(particleCenter.x, particleCenter.y);
      this.canvas.rotate(rotation);
      this.canvas.translate(-particleCenter.x, -particleCenter.y);
      this.canvas.rect(x, y, particleSize, particleSize);
      this.canvas.fillStyle = `rgba(128, 128, 128, ${1 * particle.remainingLife()})`;
      this.canvas.fill();
      this.canvas.resetTransform();
      particle.update(elapsedTime);
    });

    this.particles = this.particles.filter((particle) => particle.timeLeft > 0);
  }

  addParticles(event) {
    const { boardStart: start, blockSize, padding } = this.settings;
    let numberOfParticles = Math.floor(Math.random() * 3 + 1);

    while (numberOfParticles-- > 0) {
      const x = start.x + event.x * (blockSize + padding);
      const y = start.y + event.y * (blockSize + padding);
      this.particles.push(new Particle(x, y));
    }
  }

  clearCanvas() {
    const { width, height } = this.settings;
    this.canvas.clearRect(0, 0, width, height);
  }

  getShapeOffsets(shapeName) {
    switch (shapeName) {
      case Shape.SHAPES.ELL:
        return new Block(0, 0.5);
      case Shape.SHAPES.LLE:
        return new Block(1, 0.5);
      case Shape.SHAPES.SQUARE:
        return new Block(1, 1);
      case Shape.SHAPES.LINE:
        return new Block(0.5, 0);
      default:
        return new Block(0.5, 1);
    }
  }
}
