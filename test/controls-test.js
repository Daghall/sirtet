import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

Feature("controls", () => {
  Scenario("move square shape up", () => {
    let board;
    Given("a board and a square one block from the top", () => {
      board = new Board(new Shape(Shape.SHAPES.SQUARE), 1, 1);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("square should be near the top", () => {
      expect(board.current.toString()).to.deep.equal("1:1,1:2,2:1,2:2");
    });

    When("moving square up", () => {
      controls.up();
    });

    Then("square should be moved", () => {
      expect(board.current.toString()).to.deep.equal("1:0,1:1,2:0,2:1");
    });

    When("trying to move beyond top", () => {
      controls.up();
    });

    Then("square should be at the same place", () => {
      expect(board.current.toString()).to.deep.equal("1:0,1:1,2:0,2:1");
    });
  });

  Scenario("move square shape down", () => {
    let board;
    Given("a board and a square one block from the bottom", () => {
      board = new Board(new Shape(Shape.SHAPES.SQUARE), 1, Board.MAX_Y - 2);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("square should be near the bottom", () => {
      expect(board.current.toString()).to.deep.equal("1:17,1:18,2:17,2:18");
    });

    When("moving square down", () => {
      controls.down();
    });

    Then("square should be moved", () => {
      expect(board.current.toString()).to.deep.equal("1:18,1:19,2:18,2:19");
    });

    When("trying to move beyond bottom", () => {
      controls.down();
    });

    Then("square should be at the same place", () => {
      expect(board.current.toString()).to.deep.equal("1:18,1:19,2:18,2:19");
    });
  });

  Scenario("move square shape left", () => {
    let board;
    Given("a board and a square one block from the left wall", () => {
      board = new Board(new Shape(Shape.SHAPES.SQUARE), 1, 1);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("square should be near the top", () => {
      expect(board.current.toString()).to.deep.equal("1:1,1:2,2:1,2:2");
    });

    When("moving square left", () => {
      controls.left();
    });

    Then("square should be moved", () => {
      expect(board.current.toString()).to.deep.equal("0:1,0:2,1:1,1:2");
    });

    When("trying to move beyond left wall", () => {
      controls.left();
    });

    Then("square should be at the same place", () => {
      expect(board.current.toString()).to.deep.equal("0:1,0:2,1:1,1:2");
    });
  });

  Scenario("move square shape right", () => {
    let board;
    Given("a board and a square one block from the right wall", () => {
      board = new Board(new Shape(Shape.SHAPES.SQUARE), Board.MAX_X - 2, 1);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("square should be near the top", () => {
      expect(board.current.toString()).to.deep.equal("7:1,7:2,8:1,8:2");
    });

    When("moving square right", () => {
      controls.right();
    });

    Then("square should be moved", () => {
      expect(board.current.toString()).to.deep.equal("8:1,8:2,9:1,9:2");
    });

    When("trying to move beyond right wall", () => {
      controls.right();
    });

    Then("square should be at the same place", () => {
      expect(board.current.toString()).to.deep.equal("8:1,8:2,9:1,9:2");
    });
  });
});
