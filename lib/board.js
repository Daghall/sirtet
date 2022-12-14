import Emitter from "./emitter.js";
import Shape from "./shape.js";
import TimeKeeper from "./time-keeper.js";

export default class Board extends Emitter {
  #timeKeeper;

  constructor(initialBlockHeight, columns, rows) {
    super();
    this.maxX = (columns || Board.DEFAULTS.COLUMNS) - 1;
    this.maxY = (rows || Board.DEFAULTS.ROWS) - 1;
    this.shapes = Shape.getRandomShapes();
    this.swapAllowed = true;
    this.nextShape();
    this.initBlocks(initialBlockHeight || Board.DEFAULTS.INITIAL_BLOCK_HEIGHT);
    this.hold = null;
    this.isPlaying = true;
    this.level = 1;
    this.experience = 0;
    this.#timeKeeper = new TimeKeeper(this);

    this.#timeKeeper.on("timeout", () => {
      this.punch();
    });
  }

  initBlocks(blockHeight = 4) {
    this.blocks = Array(this.maxX + 1)
      .fill()
      .map(() => {
        return Array(this.maxY + 1)
          .fill(0)
          .fill(1, -blockHeight);
      });
  }

  nextShape({ swapAllowed = true } = {}) {
    const oldShape = this.die;
    const shapeName = this.shapes.shift();
    this.setShape(new Shape(shapeName, this.maxX, this.maxY));
    if (oldShape) {
      const { x, y } = oldShape;
      this.die.moveTo(x, y);
    }

    this.swapAllowed = swapAllowed;

    if (this.shapes.length === 0) {
      this.shapes = Shape.getRandomShapes();
    }
  }

  swapShape() {
    if (!this.isPlaying) return;

    if (this.swapAllowed) {
      const hold = this.hold;
      this.hold = this.die;
      this.swapAllowed = false;

      if (hold) {
        this.die = hold;
        this.die.moveTo(this.hold);
      } else {
        this.nextShape({ swapAllowed: false });
      }

      this.hold.reset();
      this.emit("good swap");
      this.#timeKeeper.reset();
    } else {
      this.emit("bad swap");
    }
  }

  setShape(shape) {
    this.die = shape;
  }

  moveUp() {
    if (!this.isPlaying) return;
    this.die.up();
  }

  moveDown() {
    if (!this.isPlaying) return;
    this.die.down();
  }

  moveLeft() {
    if (!this.isPlaying) return;
    this.die.left();
  }

  moveRight() {
    if (!this.isPlaying) return;
    this.die.right();
  }

  punch() {
    if (!this.isPlaying) return;
    this.#timeKeeper.reset();

    const good = this.die.shape.filter(({ x, y }) => {
      return this.blocks[x][y] === 1;
    });
    const penalties = 4 - good.length;

    good.forEach(({ x, y }) => {
      this.blocks[x][y] = 0;
      this.emit("punch", { x, y });
    });

    if (good.length > 0) {
      this.emit("good punch");
    } else {
      this.emit("bad punch");
    }

    this.removeEmptyLines(good);

    this.addBlocks(penalties);
    this.nextShape();
  }

  addBlocks(number) {
    const removed = [];
    this.blocks.forEach((column) => {
      removed.push(...column.splice(0, number));
      column.push(...Array(number).fill(1));
    });

    const isOverflowing = removed.some((block) => block === 1);
    if (isOverflowing) {
      this.isPlaying = false;
      this.emit("death");
    }
  }

  removeEmptyLines(good) {
    let minY = this.maxY;
    let maxY = 0;

    good.forEach(({ x, y }) => {
      if (this.blocks[x][y]) return;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    const clearedLines = [];
    for (let y = minY; y <= maxY; ++y) {
      const cleared = this.blocks.every((column) => column[y] === 0);

      if (cleared) {
        clearedLines.push(y);
      }
    }

    if (clearedLines.length > 0) {
      const from = clearedLines[0];
      const number = clearedLines.length;
      this.#increaseExperience(number);

      this.blocks.forEach((column) => {
        column.splice(from, number);
        column.unshift(...Array(number).fill(0));
      });

      const penalties = 4 - good.length;
      if (this.#isEmpty() && penalties === 0) {
        this.initBlocks();
        this.emit("full clear");
      } else {
        this.emit("line cleared", clearedLines.length);
      }
    }
  }

  getTimerProgress() {
    return this.#timeKeeper.getProgress();
  }

  #increaseExperience(number) {
    this.experience += number;

    if (this.experience >= 10) {
      ++this.level;
      this.experience %= 10;
      this.emit("level up");
    }
  }

  #isEmpty() {
    return this.blocks
      .flat()
      .every((block) => {
        return block === 0;
      });
  }

  updateTimer(time) {
    if (!this.isPlaying) return;
    this.#timeKeeper.update(time);
  }

  update(time) {
    // TODO: Move this, and set a variable to check if this should be run:

    const totalBricks = (this.maxX + 1) * (this.maxY + 1);
    const animationRate = 1500;
    let numberOfBricks = Math.round(totalBricks * (time / animationRate));
    const eligibleColumns = this.blocks.filter((block) => block[this.maxY] !== 2);
    let numberExploded = 0;
    while (numberOfBricks-- > 0 && eligibleColumns.length > 0) {
      const columnIndex = Math.floor(Math.random() * eligibleColumns.length);
      const column = eligibleColumns[columnIndex];
      const rowIndex = column.findIndex((block) => block !== 2);

      if (rowIndex < 0) return;

      if (column[rowIndex] === 1) {
        this.emit("explode", { x: columnIndex, y: rowIndex });
      }
      column[rowIndex] = 2;
      ++numberExploded;
    }

    if (numberExploded === 0) {
      this.emit("game over");
    }
  }

  setBoard(blocks) {
    this.blocks = blocks;
    this.maxX = blocks.length - 1;
    this.maxY = blocks[0].length - 1;
  }

  rotateClockwise() {
    if (!this.isPlaying) return;

    this.die.rotateClockwise();
    this.emit("rotate");
  }

  rotateCounterClockwise() {
    if (!this.isPlaying) return;

    this.die.rotateCounterClockwise();
    this.emit("rotate");
  }

  toString({ showShape = false } = {}) {
    // Deep copy of two-dimensional vector
    const blocks = this.blocks.reduce((acc, die) => {
      acc.push(die.slice());
      return acc;
    }, []);
    if (showShape) {
      this.die.shape.forEach(({ x, y }) => {
        blocks[x][y] += 2;
      });
    }
    return blocks.map((column) => {
      return column.join("");
    }).join("\n");
  }

  static DEFAULTS = {
    INITIAL_BLOCK_HEIGHT: 4,
    ROWS: 20,
    COLUMNS: 10,
  };
}
