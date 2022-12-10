import { expect } from "chai";
import pythia from "the-pythia";
import ck from "chronokinesis";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import ScoreKeeper from "../lib/score-keeper.js";
import Shape from "../lib/shape.js";

Feature("Death", () => {
  Scenario("player dies", () => {
    before(() => {
      pythia.predict(0);
    });
    after(pythia.forget);

    let board;
    Given("a board", () => {
      board = new Board();
    });

    let hasDied = false;
    And("an event listener", () => {
      board.on("death", () => {
        hasDied = true;
      });
    });

    And("the board is about to overflow", () => {
      board.setBoard([
        [ 1, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 1 ],
        [ 1, 1, 1, 0, 1 ],
        [ 1, 1, 1, 1, 1 ],
      ]);
    });

    And("the shape is a LINE", () => {
      board.die.moveTo(2, 3);
    });

    Then("the board should be playing", () => {
      expect(board.isPlaying, "is playing").to.equal(true);
    });

    let controls;
    And("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("punching", () => {
      controls.punch();
    });

    Then("the player should have died", () => {
      expect(hasDied, "player dead").to.equal(true);
    });

    And("the board should be in the paused state", () => {
      expect(board.isPlaying, "is playing").to.equal(false);
    });

    And("the current die should be the TEE", () => {
      expect(board.die.toString()).to.equal("TEE 1:3,2:2,2:3,3:3");
    });

    When("moving up and right", () => {
      controls.up();
      controls.right();
    });

    Then("shape has not moved", () => {
      const { x, y } = board.die;
      expect(x, "die x").to.equal(2);
      expect(y, "die y").to.equal(3);
    });

    When("moving down and left", () => {
      controls.up();
      controls.right();
    });

    Then("shape has not moved", () => {
      const { x, y } = board.die;
      expect(x, "die x").to.equal(2);
      expect(y, "die y").to.equal(3);
    });

    When("trying to punch", () => {
      controls.punch();
    });

    Then("the die should still be the next in line – TEE", () => {
      expect(board).to.have.nested.property("die.name", Shape.SHAPES.TEE);
    });

    When("trying to swap", () => {
      controls.swapShape();
    });

    Then("hold should be empty", () => {
      expect(board.hold).to.equal(null);
    });

    And("the die should still be TEE", () => {
      expect(board).to.have.nested.property("die.name", Shape.SHAPES.TEE);
    });

    When("trying to rotate clockwise", () => {
      board.rotateClockwise();
      board.rotateClockwise();
    });

    Then("the die should note have rotated", () => {
      expect(board.die.toString()).to.equal("TEE 1:3,2:2,2:3,3:3");
    });

    When("trying to rotate counter-clockwise ", () => {
      board.rotateCounterClockwise();
    });

    Then("the die should note have rotated", () => {
      expect(board.die.toString()).to.equal("TEE 1:3,2:2,2:3,3:3");
    });
  });

  Scenario("game over screen", () => {
    before(() => {
      pythia.predict([ 0, 0.25, 0.5, 0.9999 ]);
      ck.freeze("2022-12-09 12:00:00");
    });
    after(() => {
      pythia.forget();
      ck.reset();
    });

    let board;
    Given("a board", () => {
      board = new Board(4, 4, 4);
    });

    let gameOver = false;
    And("an event listener", () => {
      board.on("game over", () => {
        gameOver = true;
      });
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board);
    });

    When("player scores", () => {
      board.emit("line cleared", 1);
    });

    And("the score is updated", () => {
      scoreKeeper.update(600);
    });

    And("the player dies", () => {
      board.isPlaying = false;
      board.emit("death");
    });

    And("the board is updated", () => {
      board.update(600);
    });

    Then("bricks are exploded", () => {
      expect(board.toString()).to.equal([
        "2211",
        "2111",
        "2111",
        "2211",
      ].join("\n"));
    });

    And("the board is updated again", () => {
      board.update(600);
    });

    Then("more bricks are exploded", () => {
      expect(board.toString()).to.equal([
        "2221",
        "2221",
        "2221",
        "2221",
      ].join("\n"));
    });

    And("the board is updated yet again", () => {
      board.update(600);
    });

    Then("all bricks are exploded", () => {
      expect(board.toString()).to.equal([
        "2222",
        "2222",
        "2222",
        "2222",
      ].join("\n"));
    });

    And("the board is updated a final time", () => {
      board.update(600);
    });

    Then("the \"game over\" event should have been emitted", () => {
      expect(gameOver, "Game over").to.equal(true);
    });

    And("the score should be added to the high score list", () => {
      expect(scoreKeeper.getHighScores()).to.deep.equal([ {
        date: Date.now(),
        score: 100,
        place: 1,
      } ]);
    });
  });
});
