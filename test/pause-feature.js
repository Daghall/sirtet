import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("pause", () => {
  Scenario("pausing", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    const pauseEvents = [];
    And("there is a listener for resuming", () => {
      board.on("pause game", (event) => {
        pauseEvents.push(event);
      });
    });

    const resumeEvents = [];
    And("there is a listener for resuming", () => {
      board.on("resume game", (event) => {
        resumeEvents.push(event);
      });
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("some time passes", () => {
      board.update(500);
    });

    Then("board state should be PLAYING", () => {
      expect(board).to.have.property("state", Board.STATES.PLAYING);
    });

    And("timer progress should have advanced", () => {
      expect(board.getTimerProgress()).to.equal(0.90);
    });

    When("pausing", () => {
      controls.pause();
    });

    Then("board state should be PAUSED", () => {
      expect(board).to.have.property("state", Board.STATES.PAUSED);
    });

    And("a pause event should have been emitted", () => {
      expect(pauseEvents).to.have.lengthOf(1);
    });

    When("more time passes", () => {
      board.update(500);
    });

    Then("timer progress should NOT have advanced", () => {
      expect(board.getTimerProgress()).to.equal(0.90);
    });

    When("hitting pause again", () => {
      controls.pause();
    });

    Then("a \"resume game\" event should have been emitted", () => {
      expect(resumeEvents).to.have.lengthOf(1);
    });

    And("board state should be RESUMING", () => {
      expect(board).to.have.property("state", Board.STATES.STARTING);
    });

    When("hitting pause again", () => {
      controls.pause();
    });

    Then("board state should again be PAUSED", () => {
      expect(board).to.have.property("state", Board.STATES.PAUSED);
    });

    And("another pause event should have been emitted", () => {
      expect(pauseEvents).to.have.lengthOf(2);
    });
  });

  Scenario("trying to pause when not playing", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    const pauseEvents = [];
    And("there is a listener for resuming", () => {
      board.on("pause game", (event) => {
        pauseEvents.push(event);
      });
    });

    const resumeEvents = [];
    And("there is a listener for resuming", () => {
      board.on("resume game", (event) => {
        resumeEvents.push(event);
      });
    });

    And("the player is dead", () => {
      board.setState(Board.STATES.DEAD);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("trying to pause", () => {
      controls.pause();
    });

    Then("board state should still be DEAD", () => {
      expect(board).to.have.property("state", Board.STATES.DEAD);
    });

    When("time passes", () => {
      board.update(500);
    });

    Then("timer progress should NOT have advanced", () => {
      expect(board.getTimerProgress()).to.equal(1);
    });

    And("no pause event should gave been emitted", () => {
      expect(pauseEvents).to.have.lengthOf(0);
    });

    And("no resume event should gave been emitted", () => {
      expect(resumeEvents).to.have.lengthOf(0);
    });
  });
});
