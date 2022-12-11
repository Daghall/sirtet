import Block from "./block.js";
import Particle from "./particle.js";
import Shape from "./shape.js";
import { colors, fonts } from "./constants.js";

export default class Renderer {
  #animateBoard;
  #animations;

  constructor(canvasElement, board, scoreKeeper) {
    this.canvas = canvasElement.getContext("2d");
    this.board = board;
    this.scoreKeeper = scoreKeeper;
    this.buildSettings(canvasElement);
    this.#animateBoard = false;
    this.#animations = {};

    this.board.on("explode", (event) => {
      this.#addBlockParticles(event);
    });

    this.board.on("punch", (event) => {
      this.#addBlockParticles(event);
    });

    this.board.on("death", () => {
      this.#playerDied();
    });

    this.board.on("game over", () => {
      this.#gameOver();
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
    this.#renderScore(elapsedTime);
    this.#renderStats();

    if (this.#animateBoard) {
      this.board.update(elapsedTime);
    }

    Object.entries(this.#animations).forEach(([ name, fn ]) => {
      const keepExecuting = fn(elapsedTime);
      if (!keepExecuting) {
        this.#removeAnimation(name);
      }
    });

    this.previousTime = time;
  }

  renderBoard() {
    const { boardStart: start, blockSize, blockWithPadding, padding } = this.settings;

    this.canvas.strokeStyle = colors.default;
    this.canvas.fillStyle = colors.default;

    // Background including border
    this.canvas.beginPath();
    this.canvas.rect(
      start.x - padding,
      start.y - padding,
      (this.board.maxX + 1) * blockWithPadding + padding,
      (this.board.maxY + 1) * blockWithPadding + padding);
    this.canvas.fillStyle = colors.default;
    this.canvas.fill();

    // Bricks
    for (let x = 0; x <= this.board.maxX; ++x) {
      for (let y = 0; y <= this.board.maxY; ++y) {
        this.canvas.beginPath();
        const left = start.x + x * (blockSize + padding);
        const top = start.y + y * (blockSize + padding);
        this.canvas.rect(left, top, blockSize, blockSize);
        switch (this.board.blocks[x][y]) {
          case 0:
            this.canvas.fillStyle = colors.bricks.empty;
            break;
          case 1:
            this.canvas.fillStyle = colors.bricks.filled;
            break;
          case 2:
            this.canvas.fillStyle = colors.default;
            break;
        }
        this.canvas.fill();
      }
    }
  }

  renderDie() {
    const { boardStart: start, blockSize, padding } = this.settings;

    this.board.die.shape.forEach(({ x, y }) => {
      if (this.board.blocks[x][y] > 1) return;
      const left = start.x + x * (blockSize + padding);
      const top = start.y + y * (blockSize + padding);

      this.canvas.beginPath();
      this.canvas.rect(left, top, blockSize, blockSize);

      if (this.board.blocks[x][y] === 1) {
        this.canvas.fillStyle = colors.die.good;
      } else {
        this.canvas.fillStyle = colors.die.bad;
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
    this.canvas.strokeStyle = colors.default;
    this.canvas.rect(start.x, start.y, boxSize, boxSize);
    this.canvas.stroke();

    // Text
    if (label) {
      this.canvas.font = fonts.default;
      this.canvas.textAlign = "center";
      this.canvas.fillStyle = colors.default;
      this.canvas.fillText(label, start.x + boxSize / 2, start.y - 10);
    }

    contentFunction();
  }

  #renderShape(shapeName, start) {
    const { blockSize, padding } = this.settings;

    if (shapeName) {
      this.canvas.beginPath();
      this.canvas.fillStyle = colors.shape;
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
    this.canvas.font = fonts.default;
    this.canvas.textAlign = "left";
    this.canvas.fillStyle = colors.default;
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

  #playerDied() {
    this.#animateBoard = true;
  }

  #gameOver() {
    this.#animateBoard = false;

    this.#addAnimation("game over", () => {
      const { boardStart: start, blockWithPadding, padding } = this.settings;
      const boardWidth = (this.board.maxX + 1) * blockWithPadding - padding;
      const center = start.x + boardWidth / 2;
      let top = start.y + 2 * blockWithPadding;

      this.canvas.shadowColor = colors.gameOver.stroke;
      this.canvas.shadowBlur = 2;
      this.canvas.font = fonts.gameOver;
      this.canvas.fillStyle = colors.gameOver.fill;
      this.canvas.strokeStyle = colors.gameOver.stroke;
      this.canvas.textAlign = "center";
      this.canvas.strokeText("GAME OVER", center, top);
      this.canvas.fillText("GAME OVER", center, top);
      this.canvas.shadowBlur = 0;

      // High scores
      const newScoreColor = Math.abs(Math.sin(this.previousTime / 500) * 255);
      const scoreHeight = 1.5 * blockWithPadding;
      this.canvas.font = fonts.highScore.score;

      if (this.scoreKeeper.isNewHighScore()) {
        this.canvas.fillStyle = `rgb(255, ${newScoreColor}, ${newScoreColor})`;
        this.canvas.fillText("NEW HIGH SCORE", center, top + scoreHeight);
      }

      // List
      top += 2 * scoreHeight;
      let currentScoreHighlighted = false;
      this.scoreKeeper.getHighScores().forEach(({ place, score, date }, i) => {
        if (this.scoreKeeper.getScore() === score && !currentScoreHighlighted) {
          this.canvas.fillStyle = `rgb(255, ${newScoreColor}, ${newScoreColor})`;
          currentScoreHighlighted = true;
        } else {
          this.canvas.fillStyle = colors.highScores.score;
        }

        this.canvas.font = fonts.highScore.score;
        this.canvas.textAlign = "left";
        this.canvas.fillText(place, start.x + blockWithPadding, top + i * scoreHeight);
        this.canvas.textAlign = "right";
        this.canvas.fillText(score, start.x + boardWidth - blockWithPadding, top + i * scoreHeight);

        this.canvas.font = fonts.highScore.date;
        this.canvas.fillStyle = colors.highScores.date;
        this.canvas.textAlign = "right";
        this.canvas.fillText(Renderer.#formatDate(date), start.x + boardWidth - blockWithPadding, top + (i + 0.3) * scoreHeight);
      });

      return Renderer.#KEEP_ANIMATING;
    });
  }

  #addAnimation(name, fn) {
    this.#animations[name] = fn.bind(this);
  }

  #removeAnimation(name) {
    delete this.#animations[name];
  }

  #addBlockParticles(event) {
    const { boardStart: start, blockSize, padding } = this.settings;
    let numberOfParticles = Math.floor(Math.random() * 3 + 1);

    while (numberOfParticles-- > 0) {
      const blockX = start.x + event.x * (blockSize + padding);
      const blockY = start.y + event.y * (blockSize + padding);
      const name = `${blockX}:${blockY}:${numberOfParticles}:${Date.now()}`;
      const particle = new Particle(blockX, blockY);

      this.#addAnimation(name, (time) => {
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
        this.canvas.fillStyle = `rgba(${colors.bricks.particle}, ${1 * particle.remainingLife()})`;
        this.canvas.fill();
        this.canvas.resetTransform();
        particle.update(time);

        return particle.timeLeft > 0;
      });
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

  static #formatDate(timestamp) {
    const date = new Date(timestamp);
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    if (date.getTime() < startOfToday) {
      // ISO formatted date, in the client's time zone
      return date.toLocaleDateString("sv-SE", { year: "numeric", month: "numeric", day: "numeric" });
    }
    return date.toTimeString().split(":").slice(0, 2).join(":");
  }

  static #KEEP_ANIMATING = true;
}
