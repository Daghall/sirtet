import Emitter from "./emitter.js";
import Shape from "./shape.js";

export default class Board extends Emitter {
  constructor(initialBlockHeight, columns, rows) {
    super();
    this.maxX = (columns || Board.DEFAULTS.COLUMNS) - 1;
    this.maxY = (rows || Board.DEFAULTS.ROWS) - 1;
    this.shapes = Shape.getRandomShapes();
    this.swapAllowed = true;
    this.nextShape();
    this.initBlocks(initialBlockHeight || Board.DEFAULTS.INITIAL_BLOCK_HEIGHT);
    this.hold = null;
    this.particles = [];
  }

  initBlocks(initialBlockHeight) {
    this.blocks = Array(this.maxX + 1)
      .fill()
      .map(() => {
        return Array(this.maxY + 1)
          .fill(0)
          .fill(1, -initialBlockHeight);
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
    } else {
      this.emit("bad swap");
    }
  }

  setShape(shape) {
    this.die = shape;
  }

  moveUp() {
    this.die.up();
  }

  moveDown() {
    this.die.down();
  }

  moveLeft() {
    this.die.left();
  }

  moveRight() {
    this.die.right();
  }

  punch() {
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

    this.removeEmptyLines();

    this.addBlocks(penalties);
    this.nextShape();
  }

  addBlocks(number) {
    const removed = [];
    this.blocks.forEach((column) => {
      removed.push(...column.splice(0, number));
      column.push(...Array(number).fill(1));
    });
  }

  removeEmptyLines() {
    let minY = this.maxY;
    let maxY = 0;

    this.die.shape.forEach(({ y }) => {
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
      this.emit("line cleared", clearedLines.length);
      const from = clearedLines[0];
      const number = clearedLines.length;

      this.blocks.forEach((column) => {
        column.splice(from, number);
        column.unshift(...Array(number).fill(0));
      });
    }
  }

  setBoard(blocks) {
    this.blocks = blocks;
  }

  rotateClockwise() {
    this.die.rotateClockwise();
    this.emit("rotate");
  }

  rotateCounterClockwise() {
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
