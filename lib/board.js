import Shape from "./shape.js";

export default class Board {
  constructor(height = 4) {
    this.shapes = Shape.getRandomShapes();
    this.nextShape();
    this.initBlocks(height);
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

  nextShape() {
    const oldShape = this.current;
    const shapeName = this.shapes.shift();
    this.setShape(new Shape(shapeName));
    if (oldShape) {
      const { x, y } = oldShape;
      this.current.moveTo(x, y);
    }

    if (this.shapes.length === 0) {
      this.shapes = Shape.getRandomShapes();
    }
  }

  setShape(shape) {
    shape.setBoard(Board);
    this.current = shape;
  }

  moveUp() {
    this.current.up();
  }

  moveDown() {
    this.current.down();
  }

  moveLeft() {
    this.current.left();
  }

  moveRight() {
    this.current.right();
  }

  drop() {
    const good = this.current.shape.filter(({ x, y }) => {
      return this.blocks[x][y] === 1;
    });
    const penalties = 4 - good.length;

    good.forEach(({ x, y }) => {
      this.blocks[x][y] = 0;
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

    this.current.shape.forEach(({ y }) => {
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
    this.current.rotateClockwise();
  }

  rotateCounterClockwise() {
    this.current.rotateCounterClockwise();
  }

  toString({ showShape = false } = {}) {
    // Deep copy of two-dimensional vector
    const blocks = this.blocks.reduce((acc, current) => {
      acc.push(current.slice());
      return acc;
    }, []);
    if (showShape) {
      this.current.shape.forEach(({ x, y }) => {
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
