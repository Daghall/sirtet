class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default class Shape {
  constructor(name) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.rotationState = 0;
    this.rotationStates = Shape.ROTAION_STATES[name];
    this.shape = this.rotationStates[0];
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
      if (shape.x > this.Board.MAX_X) return this.left();
      if (shape.y < 0) return this.down();
      if (shape.y > this.Board.MAX_Y) return this.up();
    }
  }

  up() {
    if (this.y > 0) {
      this.moveTo(this.x, this.y - 1);
    }
  }

  down() {
    if (this.y <= this.Board.MAX_Y) {
      this.moveTo(this.x, this.y + 1);
    }
  }

  left() {
    if (this.x > 0) {
      this.moveTo(this.x - 1, this.y);
    }
  }

  right() {
    if (this.x <= this.Board.MAX_X) {
      this.moveTo(this.x + 1, this.y);
    }
  }

  rotateClockwise() {
    this.rotate(1);
  }

  rotateCounterClockwise() {
    this.rotate(-1);
  }

  rotate(direction) {
    this.rotationState += direction + this.rotationStates.length;
    this.rotationState %= this.rotationStates.length;
    this.shape = this.rotationStates[this.rotationState];
    this.moveTo(this.x, this.y);
  }

  toString() {
    const blocks = this.shape
      .slice()
      .sort((a, b) => {
        if (a.x === b.x) {
          return a.y < b.y ? -1 : 1;
        } else {
          return a.x < b.x ? -1 : 1;
        }
      })
      .map((block) => {
        return `${block.x}:${block.y}`;
      })
      .join(",");
    return `${this.name} ${blocks}`;
  }

  setBoard(Board) {
    this.Board = Board;
  }

  // Block 1,1 is the rotation axis
  static ROTAION_STATES = {
    square: [
      [ new Block(1, 1), new Block(0, 0), new Block(0, 1), new Block(1, 0) ],
    ],
    zed: [
      [ new Block(1, 1), new Block(0, 0), new Block(1, 0), new Block(2, 1) ],
      [ new Block(1, 1), new Block(0, 1), new Block(1, 0), new Block(0, 2) ],
    ],
    tee: [
      [ new Block(1, 1), new Block(0, 1), new Block(1, 0), new Block(2, 1) ],
      [ new Block(1, 1), new Block(1, 0), new Block(1, 2), new Block(2, 1) ],
      [ new Block(1, 1), new Block(0, 1), new Block(1, 2), new Block(2, 1) ],
      [ new Block(1, 1), new Block(0, 1), new Block(1, 2), new Block(1, 0) ],
    ],
    line: [
      [ new Block(1, 1), new Block(1, 0), new Block(1, 2), new Block(1, 3) ],
      [ new Block(1, 1), new Block(0, 1), new Block(2, 1), new Block(3, 1) ],
    ],
  };

  static SHAPES = {
    SQUARE: "square",
    TEE: "tee",
    ZED: "zed",
    LINE: "line",
    // DEZ: "dez",
    // ELL: "ell",
    // LLE: "lle",
  };

  static getRandomShapes() {
    const availableShapes = Object.values(Shape.SHAPES);
    const shuffledArray = [];
    if (window.location.search.includes("debug")) {
      Math.random = () => 0;
    }

    while (availableShapes.length > 0) {
      const index = Math.floor(Math.random() * availableShapes.length);
      const randomItem = availableShapes.splice(index, 1).pop();
      shuffledArray.push(randomItem);
    }

    return shuffledArray;
  }
}
