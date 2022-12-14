import pythia from "the-pythia";
import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import ScoreKeeper from "../lib/score-keeper.js";

Feature("Auto punching", () => {
  Scenario("timeout", () => {
    const events = [];
    before(() => {
      pythia.predict(0);
    });
    after(pythia.forget);

    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("a gap in the board", () => {
      board.setBoard([
        [ 0, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 1 ],
        [ 1, 1, 1, 1, 1 ],
        [ 0, 1, 1, 1, 1 ],
        [ 0, 0, 1, 1, 1 ],
      ]);
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("punch events are listened for", () => {
      board.on("punch", (event) => {
        events.push(event);
      });
    });

    Then("the level should be one", () => {
      expect(board).to.have.property("level", 1);
    });

    And("The score should be zero", () => {
      expect(scoreKeeper.getScore()).to.equal(0);
    });

    When("the timer ticks down", () => {
      board.updateTimer(500);
    });

    Then("timer progress should be updated", () => {
      expect(board.getTimerProgress()).to.equal(0.9);
    });

    When("the die is swapped", () => {
      controls.swapShape();
    });

    Then("the timer should be reset", () => {
      expect(board.getTimerProgress()).to.equal(1);
    });

    When("the level's time limit is exceeded", () => {
      board.updateTimer(5001);
    });

    Then("a punch should have been done", () => {
      expect(events).to.length.to.have.lengthOf(4);
    });

    When("moving shape", () => {
      controls.right();
      controls.right();
    });

    And("the level's time limit is exceeded", () => {
      board.updateTimer(5001);
    });

    Then("a punch should have been done", () => {
      expect(events).to.length.to.have.lengthOf(8);
    });

    And("The score should be updated", () => {
      expect(scoreKeeper.getBuffered()).to.equal(250);
    });
  });
});
