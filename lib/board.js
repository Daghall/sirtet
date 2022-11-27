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
    this.current = new Shape(shapeName);
    this.current.setBoard(Board);
    if (oldShape) {
      const { x, y } = oldShape;
      this.current.moveTo(x, y);
    }

    if (this.shapes.length === 0) {
      this.shapes = Shape.getRandomShapes();
    }
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

    // TODO: remove empty lines that was just cleared

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

  rotateClockwise() {
    this.current.rotateClockwise();
  }

  rotateCounterClockwise() {
    this.current.rotateCounterClockwise();
  }

  toString() {
    return this.blocks.map((column) => {
      return column.join("");
    }).join("\n");
  }
  static MAX_Y = 20 - 1;
  static MAX_X = 10 - 1;
}
