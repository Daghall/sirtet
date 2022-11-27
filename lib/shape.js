class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function randomIndex(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export default class Shape {
  constructor(name) {
    this.x = 0;
    this.y = 0;

    switch (name) {
      case "square":
        this.shape = [ new Block(0, 0), new Block(0, 1), new Block(1, 0), new Block(1, 1) ];
        break;
    }
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    const xDiff = x - this.shape[0].x;
    const yDiff = y - this.shape[0].y;

    this.shape.forEach((block) => {
      block.x += xDiff;
      block.y += yDiff;
    });

    for (let i = 0; i < 4; ++i) {
      const shape = this.shape[i];
      if (shape.x < 0) return this.right();
      if (shape.x > this.board.MAX_X) return this.left();
      if (shape.y < 0) return this.down();
      if (shape.y > this.board.MAX_Y) return this.up();
    }

    // TODO: sort?
  }

  up() {
    if (this.y > 0) {
      this.moveTo(this.x, this.y - 1);
    }
  }

  down() {
    if (this.y <= this.board.MAX_Y) {
      this.moveTo(this.x, this.y + 1);
    }
  }

  left() {
    if (this.x > 0) {
      this.moveTo(this.x - 1, this.y);
    }
  }

  right() {
    if (this.x <= this.board.MAX_X) {
      this.moveTo(this.x + 1, this.y);
    }
  }

  toString() {
    return this.shape.map((block) => {
      return `${block.x}:${block.y}`;
    }).sort().join(",");
  }

  setBoard(board) {
    this.board = board;
  }

  static SHAPES = {
    SQUARE: "square",
    LINE: "line",
    TEE: "tee",
    ZED: "zed",
    DEZ: "dez",
  };

  static randomShape() {
    return new Shape(randomIndex(Shape.SHAPES));
  }
}
