import { expect } from "chai";
import pythia from "the-pythia";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

Feature("Board", () => {
  before(() => {
    pythia.predict(0);
  });
  after(pythia.forget);

  Scenario("removing empty lines at the top, after punch", () => {
    let board;
    When("a board is created", () => {
      board = new Board();
    });

    And("setting the board", () => {
      board.setBoard([
        [ 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 1, 1, 1, 1 ],
        [ 0, 0, 1, 1, 1, 1 ],
      ]);
    });

    Then("there should be a board with a square on top", () => {
      expect(board.toString()).to.equal([
        "000011",
        "000011",
        "000011",
        "000011",
        "001111",
        "001111",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("shape is moved to top of the bricks", () => {
      const x = 5;
      const y = 3;
      board.die.moveTo(x, y);
    });

    Then("square should be in the middle", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.toString({ showShape: true })).to.equal([
        "000011",
        "000011",
        "000011",
        "000011",
        "003311",
        "003311",
      ].join("\n"));
    });

    When("punching the shape", () => {
      controls.punch();
    });

    Then("the square should be gone", () => {
      expect(board.toString()).to.equal([
        "000011",
        "000011",
        "000011",
        "000011",
        "000011",
        "000011",
      ].join("\n"));
    });
  });

  Scenario("removing empty lines in the middle, after punch", () => {
    let board;
    When("a board is created", () => {
      board = new Board();
    });

    And("setting the board", () => {
      board.setBoard([
        [ 1, 1, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 1, 1 ],
        [ 1, 1, 0, 0, 1, 1 ],
        [ 1, 1, 0, 0, 1, 1 ],
        [ 1, 1, 0, 0, 1, 1 ],
        [ 1, 1, 0, 0, 1, 1 ],
      ]);
    });

    Then("there should be a board with a gap", () => {
      expect(board.toString()).to.equal([
        "111111",
        "111111",
        "110011",
        "110011",
        "110011",
        "110011",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("shape is moved to top of the bricks", () => {
      const x = 0;
      const y = 3;
      board.die.moveTo(x, y);
    });

    Then("square should be in the middle", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.toString({ showShape: true })).to.equal([
        "113311",
        "113311",
        "110011",
        "110011",
        "110011",
        "110011",
      ].join("\n"));
    });

    When("punching the shape", () => {
      controls.punch();
    });

    Then("the square should be gone", () => {
      expect(board.toString()).to.equal([
        "001111",
        "001111",
        "001111",
        "001111",
        "001111",
        "001111",
      ].join("\n"));
    });
  });

  Scenario("removing empty lines at the bottom, after punch", () => {
    let board;
    When("a board is created", () => {
      board = new Board();
    });

    And("setting the board", () => {
      board.setBoard([
        [ 1, 1, 0, 0 ],
        [ 1, 1, 1, 1 ],
        [ 1, 1, 1, 1 ],
        [ 1, 1, 0, 0 ],
      ]);
    });

    Then("there should be a board with a gap", () => {
      expect(board.toString()).to.equal([
        "1100",
        "1111",
        "1111",
        "1100",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("shape is moved to top of the bricks", () => {
      const x = 2;
      const y = 3;
      board.die.moveTo(x, y);
    });

    Then("square should be in the middle", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.toString({ showShape: true })).to.equal([
        "1100",
        "1133",
        "1133",
        "1100",
      ].join("\n"));
    });

    When("punching the shape", () => {
      controls.punch();
    });

    Then("the square should be gone", () => {
      expect(board.toString()).to.equal([
        "0011",
        "0011",
        "0011",
        "0011",
      ].join("\n"));
    });
  });

  Scenario("removing empty lines at the bottom with a standing LINE, after punch", () => {
    let board;
    When("a board is created", () => {
      board = new Board();
    });

    And("setting the board", () => {
      board.setBoard([
        [ 1, 1, 1, 1, 1, 1 ],
        [ 1, 0, 0, 0, 0, 1 ],
        [ 1, 0, 0, 0, 0, 1 ],
        [ 1, 0, 0, 0, 0, 1 ],
      ]);
    });

    Then("there should be a board with a gap", () => {
      expect(board.toString()).to.equal([
        "111111",
        "100001",
        "100001",
        "100001",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("the shape is a LINE", () => {
      board.setShape(new Shape(Shape.SHAPES.LINE));
    });

    And("shape is moved into position", () => {
      const x = 0;
      const y = 2;
      board.die.moveTo(x, y);
    });

    Then("LINE should be at the bottom right", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.toString({ showShape: true })).to.equal([
        "133331",
        "100001",
        "100001",
        "100001",
      ].join("\n"));
    });

    When("punching the shape", () => {
      controls.punch();
    });

    Then("the square should be gone", () => {
      expect(board.toString()).to.equal([
        "000011",
        "000011",
        "000011",
        "000011",
      ].join("\n"));
    });
  });

  Scenario("removing empty lines at the bottom with a lying LINE, after punch", () => {
    let board;
    When("a board is created", () => {
      board = new Board();
    });

    And("setting the board", () => {
      board.setBoard([
        [ 1, 0, 1 ],
        [ 1, 1, 1 ],
        [ 1, 1, 1 ],
        [ 1, 1, 1 ],
        [ 1, 1, 1 ],
        [ 1, 0, 1 ],
      ]);
    });

    Then("there should be a board with two gaps", () => {
      expect(board.toString()).to.equal([
        "101",
        "111",
        "111",
        "111",
        "111",
        "101",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("the shape is a LINE", () => {
      board.setShape(new Shape(Shape.SHAPES.LINE));
    });

    And("shape is moved into position and rotated", () => {
      const x = 2;
      const y = 1;
      controls.rotateClockwise();
      board.die.moveTo(x, y);
    });

    Then("LINE should be at the bottom right", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.toString({ showShape: true })).to.equal([
        "101",
        "131",
        "131",
        "131",
        "131",
        "101",
      ].join("\n"));
    });

    When("punching the shape", () => {
      controls.punch();
    });

    Then("the square should be gone", () => {
      expect(board.toString()).to.equal([
        "011",
        "011",
        "011",
        "011",
        "011",
        "011",
      ].join("\n"));
    });
  });

  Scenario("constructor parameters", () => {
    let board;
    When("a board is created with parameters", () => {
      board = new Board(5, 7, 9);
    });

    Then("the resulting board should reflect the parameters", () => {
      expect(board.toString()).to.equal([
        "000011111",
        "000011111",
        "000011111",
        "000011111",
        "000011111",
        "000011111",
        "000011111",
      ].join("\n"));
    });
  });

  Scenario("full clear", () => {
    const events = [];

    let board;
    Given("a board", () => {
      board = new Board(4, 4, 6);
    });

    And("punch events are listened for", () => {
      board.on("full clear", (event) => {
        events.push(event);
      });
    });

    When("the board is almost cleared", () => {
      board.setBoard([
        [ 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 0, 0, 1, 1 ],
        [ 0, 0, 0, 0, 0, 0 ],
      ]);
    });

    Then("there should be an almost empty board", () => {
      expect(board.toString()).to.equal([
        "000000",
        "000011",
        "000011",
        "000000",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("shape is moved the non-cleared bricks", () => {
      const x = 2;
      const y = 5;
      board.die.moveTo(x, y);
    });

    Then("square should be in the bottom middle", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.toString({ showShape: true })).to.equal([
        "000000",
        "000033",
        "000033",
        "000000",
      ].join("\n"));
    });

    When("punching the shape", () => {
      controls.punch();
    });

    Then("there should have been a \"full clear\" event emitted", () => {
      expect(events).to.have.lengthOf(1);
    });

    And("the lower four rows should be filled", () => {
      expect(board.toString()).to.equal([
        "001111",
        "001111",
        "001111",
        "001111",
      ].join("\n"));
    });
  });
});
