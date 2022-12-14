import { expect } from "chai";
import pythia from "the-pythia";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("Moving", () => {
  before(() => {
    pythia.predict(0);
  });
  after(pythia.forget);

  Scenario("move SQUARE shape up", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("a SQUARE one block from the top", () => {
      board.die.moveTo(2, 2);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("SQUARE should be near the top", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 1:1,1:2,2:1,2:2");
    });

    When("moving SQUARE up", () => {
      controls.up();
    });

    Then("SQUARE should be moved", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 1:0,1:1,2:0,2:1");
    });

    When("trying to move beyond top", () => {
      controls.up();
    });

    Then("SQUARE should be at the same place", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 1:0,1:1,2:0,2:1");
    });
  });

  Scenario("move SQUARE shape down", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("a SQUARE one block from the bottom", () => {
      board.die.moveTo(2, board.maxY - 1);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("SQUARE should be near the bottom", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 1:17,1:18,2:17,2:18");
    });

    When("moving SQUARE down", () => {
      controls.down();
    });

    Then("SQUARE should be moved", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 1:18,1:19,2:18,2:19");
    });

    When("trying to move beyond bottom", () => {
      controls.down();
    });

    Then("SQUARE should be at the same place", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 1:18,1:19,2:18,2:19");
    });
  });

  Scenario("move SQUARE shape left", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("a SQUARE one block from the left wall", () => {
      board.die.moveTo(2, 2);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("SQUARE should be near the top", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 1:1,1:2,2:1,2:2");
    });

    When("moving SQUARE left", () => {
      controls.left();
    });

    Then("SQUARE should be moved", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 0:1,0:2,1:1,1:2");
    });

    When("trying to move beyond left wall", () => {
      controls.left();
    });

    Then("SQUARE should be at the same place", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 0:1,0:2,1:1,1:2");
    });
  });

  Scenario("move SQUARE shape right", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("a SQUARE one block from the right wall", () => {
      board.die.moveTo(board.maxX - 1, 2);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("SQUARE should be near the top", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 7:1,7:2,8:1,8:2");
    });

    When("moving SQUARE right", () => {
      controls.right();
    });

    Then("SQUARE should be moved", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 8:1,8:2,9:1,9:2");
    });

    When("trying to move beyond right wall", () => {
      controls.right();
    });

    Then("SQUARE should be at the same place", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 8:1,8:2,9:1,9:2");
    });
  });
});
