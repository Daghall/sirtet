import AnimatableBlock from "./animatable-block.js";
import Block from "./block.js";
import Board from "./board.js";
import { colors, fonts } from "./constants.js";
import Confetto from "./confetto.js";
import Particle from "./particle.js";
import Shape from "./shape.js";

export default class Renderer {
  #animateBoard;
  #animations;
  #board;
  #canvas;
  #playTime;
  #scoreKeeper;
  #settings;
  #previousTime;

  constructor(canvasElement, board, scoreKeeper) {
    this.#canvas = canvasElement.getContext("2d");
    this.#board = board;
    this.#scoreKeeper = scoreKeeper;
    this.#buildSettings(canvasElement);
    this.#animateBoard = false;
    this.#animations = {};
    this.#playTime = "0:00";

    this.#board.on("explode", (event) => {
      this.#addBlockParticles(event);
    });

    this.#board.on("punch", (event) => {
      this.#addBlockParticles(event);
      this.#settings.boardStart.offset = 2;
      let ttl = 100;
      this.#addAnimation("board punch", (time) => {
        ttl -= time;
        if (ttl < 0) {
          this.#settings.boardStart.offset = 0;
        }
        return ttl > 0;
      });
    });

    this.#board.on("death", () => {
      this.#playerDied();
    });

    this.#board.on("game over", () => {
      this.#gameOver();
    });

    this.#board.on("pause game", () => {
      this.#removeAnimation("starting");
      const { width, height } = this.#settings;
      this.#addAnimation("paused", () => {
        // Overlay
        this.#canvas.fillStyle = colors.paused.overlay;
        this.#canvas.beginPath();
        this.#canvas.rect(0, 0, width, height);
        this.#canvas.fill();

        // Text
        this.#canvas.fillStyle = colors.paused.text;
        this.#canvas.textAlign = "center";
        this.#canvas.font = fonts.paused;
        this.#canvas.fillText("PAUSED", width / 2, height / 2);
        return !this.#board.isPlaying();
      });
    });

    this.#board.on("resume game", () => {
      this.#renderCountdown(() => {
        this.#board.setState(Board.STATES.PLAYING);
      });
    });
  }

  #buildSettings(canvasElement) {
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
      offset: 0,
    };
    const nextStart = {
      x: boardStart.x + (this.#board.maxX + 2) * blockWithPadding,
      y: top,
    };

    this.#settings = {
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
    const elapsedTime = time - (this.#previousTime || 0);
    this.#clearCanvas();
    this.#renderBoard();
    this.#renderDie();
    this.#renderHold();
    this.#renderNext();
    this.#renderScore(elapsedTime);
    this.#renderStats();
    this.#renderFps(elapsedTime);
    this.#renderTimer(elapsedTime);
    this.#renderLevel(time);

    if (this.#animateBoard) {
      this.#board.update(elapsedTime);
    }

    Object.entries(this.#animations).forEach(([ name, fn ]) => {
      const keepExecuting = fn(elapsedTime);
      if (!keepExecuting) {
        this.#removeAnimation(name);
      }
    });

    this.#previousTime = time;
  }

  #renderBoard() {
    const { boardStart: start, blockSize, blockWithPadding, padding } = this.#settings;

    this.#canvas.strokeStyle = colors.default;
    this.#canvas.fillStyle = colors.default;

    // Background including border
    this.#canvas.beginPath();
    this.#canvas.rect(
      start.x - padding,
      start.y - padding,
      (this.#board.maxX + 1) * blockWithPadding + padding,
      (this.#board.maxY + 1) * blockWithPadding + padding);
    this.#canvas.fillStyle = colors.default;
    this.#canvas.fill();

    // Bricks
    for (let x = 0; x <= this.#board.maxX; ++x) {
      for (let y = 0; y <= this.#board.maxY; ++y) {
        this.#canvas.beginPath();
        const left = start.x + x * (blockSize + padding);
        const top = start.y + y * (blockSize + padding);
        this.#canvas.rect(left, top, blockSize, blockSize);
        switch (this.#board.blocks[x][y]) {
          case 0:
            this.#canvas.fillStyle = colors.bricks.empty;
            break;
          case 1:
            this.#canvas.fillStyle = colors.bricks.filled;
            break;
          case 2:
            this.#canvas.fillStyle = colors.default;
            break;
        }
        this.#canvas.fill();
      }
    }
  }

  #renderDie() {
    const { boardStart: start, blockSize, padding } = this.#settings;

    this.#board.die.shape.forEach(({ x, y }) => {
      if (this.#board.blocks[x][y] > 1) return;
      const left = start.x + x * (blockSize + padding);
      const top = start.y + y * (blockSize + padding) + start.offset;

      this.#canvas.beginPath();
      this.#canvas.rect(left, top, blockSize, blockSize);

      if (this.#board.blocks[x][y] === 1) {
        this.#canvas.fillStyle = colors.die.good;
      } else {
        this.#canvas.fillStyle = colors.die.bad;
      }
      this.#canvas.fill();
    });
  }

  #renderHold() {
    const { holdStart: start } = this.#settings;
    const { name: shapeName } = this.#board.hold || {};
    this.#renderBox("HOLD", start, () => {
      this.#renderShape(shapeName, start);
    });
  }

  #renderNext() {
    const { nextStart: start } = this.#settings;
    this.#renderBox("NEXT", start, () => {
      this.#renderShape(this.#board?.shapes[0], start);
    });
  }

  #renderCountdown(callback) {
    let countdown = 3000;
    const { width, height, blockSize, blockWithPadding, padding } = this.#settings;
    const numberWidth = 3 * blockWithPadding - padding;
    const numberHeight = 5 * blockWithPadding - padding;
    const start = {
      x: (width - numberWidth) / 2,
      y: (height - numberHeight) / 2,
    };

    const numberBlocks = [
      new AnimatableBlock(0, 0, blockWithPadding)
        .addAnimation(1000, { y: 1 }),
      new Block(1, 0),
      new AnimatableBlock(2, 1, blockWithPadding)
        .addAnimation(2000, { x: 1 }),
      new AnimatableBlock(0, 2, blockWithPadding)
        .addAnimation(1000, { y: 3 })
        .addAnimation(2000, { x: 1 }),
      new Block(1, 2),
      new AnimatableBlock(2, 3, blockWithPadding)
        .addAnimation(1000, { y: 4 }),
      new Block(0, 4),
      new Block(1, 4),
    ];

    this.#removeAnimation("paused");
    this.#addAnimation("starting", (time) => {
      countdown -= time;

      // Overlay
      this.#canvas.fillStyle = colors.paused.overlay;
      this.#canvas.beginPath();
      this.#canvas.rect(0, 0, width, height);
      this.#canvas.fill();

      // Numbers
      this.#canvas.beginPath();
      numberBlocks.forEach((block) => {
        let offsetX = 0;
        let offsetY = 0;
        if (block instanceof AnimatableBlock) {
          block.update(time);
          offsetX = block.offset.x;
          offsetY = block.offset.y;
        }
        const x = block.x * blockWithPadding + start.x + offsetX;
        const y = block.y * blockWithPadding + start.y + offsetY;
        this.#canvas.rect(x, y, blockSize, blockSize);
      });

      this.#canvas.fillStyle = colors.countdown;
      this.#canvas.fill();

      if (countdown <= 0) {
        callback();
        return false;
      }
      return true;
    });
  }

  #renderBox(label, start, contentFunction) {
    const { boxSize } = this.#settings;

    // Border
    this.#canvas.beginPath();
    this.#canvas.strokeStyle = colors.default;
    this.#canvas.rect(start.x, start.y, boxSize, boxSize);
    this.#canvas.stroke();

    // Text
    if (label) {
      this.#canvas.font = fonts.default;
      this.#canvas.textAlign = "center";
      this.#canvas.fillStyle = colors.default;
      this.#canvas.fillText(label, start.x + boxSize / 2, start.y - 10);
    }

    contentFunction();
  }

  #renderShape(shapeName, start) {
    const { blockSize, padding } = this.#settings;

    if (shapeName) {
      this.#canvas.beginPath();
      this.#canvas.fillStyle = colors.shape;
      const shapeOffset = this.#getShapeOffsets(shapeName);
      const startX = start.x + shapeOffset.x * (blockSize + padding) + padding;
      const startY = start.y + shapeOffset.y * (blockSize + padding) + padding;

      Shape.ROTAION_STATES[shapeName][0].forEach(({ x, y }) => {
        const left = startX + x * (blockSize + padding);
        const top = startY + y * (blockSize + padding);
        this.#canvas.rect(left, top, blockSize, blockSize);
        this.#canvas.fill();
      });
    }
  }

  #renderScore(elapsedTime) {
    const { boardStart: start, blockWithPadding, padding } = this.#settings;
    const boardWidth = (this.#board.maxX + 1) * blockWithPadding - padding;

    // Label
    this.#canvas.font = fonts.default;
    this.#canvas.textAlign = "left";
    this.#canvas.fillStyle = colors.default;
    this.#canvas.fillText("SCORE", start.x, start.y - 10);

    // Score
    this.#canvas.textAlign = "right";
    this.#canvas.fillText(this.#scoreKeeper.getScore(), start.x + boardWidth, start.y - 10);
    this.#scoreKeeper.update(elapsedTime);
  }

  #renderStats() {
    const { nextStart, blockSize, blockWithPadding, boxSize, padding } = this.#settings;
    const start = { ...nextStart };
    start.y += boxSize + blockWithPadding + padding;

    this.#renderBox(null, start, () => {
      Object.entries(this.#scoreKeeper.getStats()).forEach(([ key, val ], i) => {
        const name = key.replace(/^./, (s) => s.toUpperCase()).replace("Full", "");
        this.#canvas.textAlign = "left";
        this.#canvas.fillText(name, start.x + padding, start.y + (i + 1) * blockSize - padding);
        this.#canvas.textAlign = "right";
        this.#canvas.fillText(val, start.x + boxSize - padding, start.y + (i + 1) * blockSize - padding);
      });
    });
  }

  #playerDied() {
    this.#animateBoard = true;
  }

  #gameOver() {
    this.#animateBoard = false;

    if (this.#scoreKeeper.isNewHighScore()) {
      this.#fireConfetti();
    }

    this.#addAnimation("game over", () => {
      const { boardStart: start, blockWithPadding, padding } = this.#settings;
      const boardWidth = (this.#board.maxX + 1) * blockWithPadding - padding;
      const center = start.x + boardWidth / 2;
      let top = start.y + 2 * blockWithPadding;

      this.#canvas.shadowColor = colors.gameOver.stroke;
      this.#canvas.shadowBlur = 2;
      this.#canvas.font = fonts.gameOver;
      this.#canvas.fillStyle = colors.gameOver.fill;
      this.#canvas.strokeStyle = colors.gameOver.stroke;
      this.#canvas.textAlign = "center";
      this.#canvas.strokeText("GAME OVER", center, top);
      this.#canvas.fillText("GAME OVER", center, top);
      this.#canvas.shadowBlur = 0;

      // High scores
      const newScoreColor = Math.abs(Math.sin(this.#previousTime / 500) * 255);
      const scoreHeight = 1.5 * blockWithPadding;
      this.#canvas.font = fonts.highScore.score;

      if (this.#scoreKeeper.isNewHighScore()) {
        this.#canvas.fillStyle = `rgb(255, ${newScoreColor}, ${newScoreColor})`;
        this.#canvas.fillText("NEW HIGH SCORE", center, top + scoreHeight);
      }

      // List
      top += 2 * scoreHeight;
      let currentScoreHighlighted = false;
      this.#scoreKeeper.getHighScores().forEach(({ place, score, date }, i) => {
        if (this.#scoreKeeper.getScore() === score && !currentScoreHighlighted) {
          this.#canvas.fillStyle = `rgb(255, ${newScoreColor}, ${newScoreColor})`;
          currentScoreHighlighted = true;
        } else {
          this.#canvas.fillStyle = colors.highScores.score;
        }

        this.#canvas.font = fonts.highScore.score;
        this.#canvas.textAlign = "left";
        this.#canvas.fillText(place, start.x + blockWithPadding, top + i * scoreHeight);
        this.#canvas.textAlign = "right";
        this.#canvas.fillText(score, start.x + boardWidth - blockWithPadding, top + i * scoreHeight);

        this.#canvas.font = fonts.highScore.date;
        this.#canvas.fillStyle = colors.highScores.date;
        this.#canvas.textAlign = "right";
        this.#canvas.fillText(Renderer.#formatDate(date), start.x + boardWidth - blockWithPadding, top + (i + 0.3) * scoreHeight);
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
    const { boardStart: start, blockSize, padding } = this.#settings;
    let numberOfParticles = Math.floor(Math.random() * 3 + 1);

    while (numberOfParticles-- > 0) {
      const blockX = start.x + event.x * (blockSize + padding);
      const blockY = start.y + event.y * (blockSize + padding);
      const name = `${blockX}:${blockY}:${numberOfParticles}:${Date.now()}`;
      const particle = new Particle(blockX, blockY);

      this.#addAnimation(name, (time) => {
        this.#canvas.beginPath();
        const { x, y, size, rotation } = particle;
        const particleSize = size * blockSize;
        const particleCenter = {
          x: x + particleSize / 2,
          y: y + particleSize / 2,
        };
        this.#rotateObject(rotation, particleCenter, () => {
          this.#canvas.rect(x, y, particleSize, particleSize);
        });
        this.#canvas.fillStyle = `rgba(${colors.bricks.particle}, ${1 * particle.remainingLife()})`;
        this.#canvas.fill();
        particle.update(time);

        return particle.timeLeft > 0;
      });
    }
  }

  #fireConfetti() {
    const { width, height } = this.#settings;
    const startY = height + 50;
    let numberOfConfetti = 250;

    while (numberOfConfetti-- > 0) {
      const direction = numberOfConfetti % 2 === 0
        ? Confetto.DIRECTION_LEFT
        : Confetto.DIRECTION_RIGHT;
      const startX = direction === Confetto.DIRECTION_LEFT ? width : 0;
      const confetto = new Confetto(startX, startY, direction, numberOfConfetti);
      const color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
      const name = `confetto:${numberOfConfetti}`;

      this.#addAnimation(name, (time) => {
        const { x, y, size, rotation, id } = confetto;
        const confettoSize = 25 * size;
        this.#canvas.beginPath();
        this.#canvas.fillStyle = color;
        const particleCenter = {
          x: confetto.x + confettoSize,
          y: confetto.y + confettoSize,
        };
        this.#rotateObject(rotation * 5, particleCenter, () => {
          this.#canvas.rect(x, y, confettoSize, confettoSize);
        }, {
          additionalTransform: () => {
            const a = Math.abs(Math.sin((this.#previousTime + id * 1000) / 100));
            const b = 1 - a;
            this.#canvas.transform(1, a, 0, b, 0, 0);
          },
        });
        this.#canvas.fill();
        confetto.update(time);
        return confetto.timeLeft > 0;
      });
    }
  }

  #rotateObject(rotation, center, callback, { additionalTransform } = {}) {
    this.#canvas.translate(center.x, center.y);
    this.#canvas.rotate(rotation);
    if (typeof additionalTransform === "function") {
      additionalTransform();
    }
    this.#canvas.translate(-center.x, -center.y);
    callback();
    this.#canvas.resetTransform();
  }

  #renderTimer(time) {
    this.#board.updateTimer(time);
    const { nextStart: start, blockWithPadding, boxSize } = this.#settings;
    const radius = (boxSize - blockWithPadding) / 2;
    const x = start.x + boxSize / 2;
    const y = 3 * (boxSize) + 2 * blockWithPadding;
    const progress = this.#board.getTimerProgress();

    this.#canvas.beginPath();
    this.#canvas.arc(x, y, radius, -Math.PI / 2, -2 * Math.PI * progress - Math.PI / 2, true);
    this.#canvas.lineTo(x, y);
    this.#canvas.lineTo(x, y - radius);
    this.#canvas.fillStyle = colors.default;
    this.#canvas.fill();
  }

  #renderLevel(time) {
    const { holdStart, boxSize, blockWithPadding, padding } = this.#settings;
    const start = { ...holdStart };
    start.y += boxSize + blockWithPadding + padding;
    const leftX = start.x + padding;
    const rightX = start.x + boxSize - padding;
    const timeString = this.#board.isPlaying() ? this.#formatTime(time) : this.#playTime;
    this.#playTime = timeString;

    this.#renderBox(null, start, () => {
      // Time
      start.y += blockWithPadding;
      this.#canvas.textAlign = "left";
      this.#canvas.fillText("Time", leftX, start.y);
      this.#canvas.textAlign = "right";
      this.#canvas.fillText(timeString, rightX, start.y);

      // Level
      start.y += blockWithPadding;
      this.#canvas.textAlign = "left";
      this.#canvas.fillText("Level", leftX, start.y);
      this.#canvas.textAlign = "right";
      this.#canvas.fillText(this.#board.level, rightX, start.y);

      // Progress bar – fill
      start.y += blockWithPadding / 2;
      const progressBarWidth = boxSize - 4 * padding;
      this.#canvas.fillStyle = colors.bricks.empty;
      this.#canvas.beginPath();
      this.#canvas.rect(start.x + 2 * padding, start.y, progressBarWidth * (this.#board.experience / 10), blockWithPadding / 2);
      this.#canvas.fill();

      // Progress bar – border
      this.#canvas.beginPath();
      this.#canvas.rect(start.x + 2 * padding, start.y, progressBarWidth, blockWithPadding / 2);
      this.#canvas.stroke();
    });
  }

  #formatTime(time) {
    const minutes = Math.floor(time / 1000 / 60);
    const seconds = Math.floor(time / 1000 % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  #renderFps(elapsedTime) {
    const { height, blockWithPadding } = this.#settings;
    const offset = blockWithPadding;
    this.#canvas.textAlign = "left";
    this.#canvas.fillText("FPS:", offset, height - offset);
    this.#canvas.textAlign = "right";
    this.#canvas.fillText(Math.round(1000 / elapsedTime), offset * 4, height - offset);

  }

  #clearCanvas() {
    const { width, height } = this.#settings;
    this.#canvas.clearRect(0, 0, width, height);
  }

  #getShapeOffsets(shapeName) {
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
