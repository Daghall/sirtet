import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

Feature("controls", () => {
  Scenario("move square shape up", () => {
    let board;
    let controls;
    Given("a board and a square one block from the top", () => {
      board = new Board(new Shape(Shape.SHAPES.SQUARE), 1, 1);
    });

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
    let controls;
    Given("a board and a square one block from the bottom", () => {
      board = new Board(new Shape(Shape.SHAPES.SQUARE), 1, Board.MAX_Y - 2);
    });

    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("square should be near the bottom", () => {
      expect(board.current.toString()).to.deep.equal("1:37,1:38,2:37,2:38");
    });

    When("moving square down", () => {
      controls.down();
    });

    Then("square should be moved", () => {
      expect(board.current.toString()).to.deep.equal("1:38,1:39,2:38,2:39");
    });

    When("trying to move beyond bottom", () => {
      controls.down();
    });

    Then("square should be at the same place", () => {
      expect(board.current.toString()).to.deep.equal("1:38,1:39,2:38,2:39");
    });
  });
});
