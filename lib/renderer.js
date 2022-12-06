import Block from "./block.js";
import Particle from "./particle.js";
import ScoreKeeper from "./score-keeper.js";
import Shape from "./shape.js";

export default class Renderer {
  constructor(canvasElement, board) {
    this.canvas = canvasElement.getContext("2d");
    this.board = board;
    this.particles = [];
    this.buildSettings(canvasElement);
    this.scoreKeeper = new ScoreKeeper(board);

    this.board.on("punch", (event) => {
      this.addParticles(event);
    });
  }

  buildSettings(canvasElement) {
    const blockSize = 15;
    const padding = 3;
    const blockWithPadding = blockSize + padding;
    const boxSize = blockSize * 4 + padding * 5;
    const top = 3 * blockSize;
    const holdStart = {
      x: 2 * blockWithPadding,
      y: top,
    };
    const boardStart = {
      x: holdStart.x + 5 * blockWithPadding + 2 * padding,
      y: top,
    };
    const nextStart = {
      x: boardStart.x + (this.board.maxX + 2) * blockWithPadding,
      y: top,
    };

    this.settings = {
      width: canvasElement.width,
      height: canvasElement.height,
      blockSize,
      blockWithPadding,
      boxSize,
      padding,
      holdStart,
      boardStart,
      nextStart,
    };
  }

  render(time) {
    const elapsedTime = time - this.previousTime;
    this.clearCanvas();
    this.renderBoard();
    this.renderDie();
    this.#renderHold();
    this.#renderNext();
    this.renderParticles(elapsedTime);
    this.#renderScore(elapsedTime);
    this.#renderStats();
    this.previousTime = time;
  }

  renderBoard() {
    const { boardStart: start, blockSize, padding } = this.settings;

    // TODO: Break out colors
    this.canvas.strokeStyle = "gray";
    this.canvas.fillStyle = "gray";
    for (let x = 0; x <= this.board.maxX; ++x) {
      for (let y = 0; y <= this.board.maxY; ++y) {
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

  renderDie() {
    const { boardStart: start, blockSize, padding } = this.settings;

    const borderWidth = 1;
    this.board.die.shape.forEach(({ x, y }) => {
      const left = start.x + x * (blockSize + padding);
      const top = start.y + y * (blockSize + padding);

      // Outline
      this.canvas.beginPath();
      this.canvas.rect(left - borderWidth, top - borderWidth, blockSize + 2 * borderWidth, blockSize + 2 * borderWidth);
      this.canvas.fillStyle = "black";
      this.canvas.fill();

      // Block
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

  #renderHold() {
    const { holdStart: start } = this.settings;
    const { name: shapeName } = this.board.hold || {};
    this.#renderBox("HOLD", start, () => {
      this.#renderShape(shapeName, start);
    });
  }

  #renderNext() {
    const { nextStart: start } = this.settings;
    this.#renderBox("NEXT", start, () => {
      this.#renderShape(this.board?.shapes[0], start);
    });
  }

  #renderBox(label, start, contentFunction) {
    const { boxSize } = this.settings;

    // Border
    this.canvas.beginPath();
    this.canvas.strokeStyle = "gray";
    this.canvas.rect(start.x, start.y, boxSize, boxSize);
    this.canvas.stroke();

    // Text
    if (label) {
      this.canvas.font = "bold 12px Arial";
      this.canvas.textAlign = "center";
      this.canvas.fillStyle = "gray";
      this.canvas.fillText(label, start.x + boxSize / 2, start.y - 10);
    }

    contentFunction();
  }

  #renderShape(shapeName, start) {
    const { blockSize, padding } = this.settings;

    if (shapeName) {
      this.canvas.beginPath();
      this.canvas.fillStyle = "gray";
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

  #renderScore(elapsedTime) {
    const { boardStart: start, blockWithPadding, padding } = this.settings;
    const boardWidth = (this.board.maxX + 1) * blockWithPadding - padding;

    // Label
    this.canvas.font = "bold 12px Arial";
    this.canvas.textAlign = "left";
    this.canvas.fillStyle = "gray";
    this.canvas.fillText("SCORE", start.x, start.y - 10);

    // Score
    this.canvas.textAlign = "right";
    this.canvas.fillText(this.scoreKeeper.getScore(), start.x + boardWidth, start.y - 10);
    this.scoreKeeper.update(elapsedTime);
  }

  #renderStats() {
    const { nextStart, blockSize, blockWithPadding, boxSize, padding } = this.settings;
    const start = { ...nextStart };
    start.y += boxSize + blockWithPadding + padding;

    this.#renderBox(null, start, () => {
      Object.entries(this.scoreKeeper.getStats()).forEach(([ key, val ], i) => {
        const name = key.replace(/^./, (s) => s.toUpperCase()).replace("Full", "");
        this.canvas.textAlign = "left";
        this.canvas.fillText(name, start.x + padding, start.y + (i + 1) * blockSize - padding);
        this.canvas.textAlign = "right";
        this.canvas.fillText(val, start.x + boxSize - padding, start.y + (i + 1) * blockSize - padding);
      });
    });
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
