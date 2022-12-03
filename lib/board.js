import Emitter from "./emitter.js";
import Shape from "./shape.js";

export default class Board extends Emitter {
  constructor(initialBlockHeight = 4) {
    super();
    this.shapes = Shape.getRandomShapes();
    this.swapAllowed = true;
    this.nextShape();
    this.initBlocks(initialBlockHeight);
    this.hold = null;
    this.particles = [];
  }

  initBlocks(height = 4) {
    this.blocks = Array(Board.MAX_X + 1)
      .fill()
      .map(() => {
        return Array(Board.MAX_Y + 1)
          .fill(0)
          .fill(1, -height);
      });
  }

  nextShape({ swapAllowed = true } = {}) {
    const oldShape = this.die;
    const shapeName = this.shapes.shift();
    this.setShape(new Shape(shapeName));
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
    }
  }

  setShape(shape) {
    shape.setBoard(Board);
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
    let minY = Board.MAX_Y;
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
  }

  rotateCounterClockwise() {
    this.die.rotateCounterClockwise();
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

  static MAX_Y = 20 - 1;
  static MAX_X = 10 - 1;
}
