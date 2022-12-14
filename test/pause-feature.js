import pythia from "the-pythia";
import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("pause", () => {
  Scenario("pausing", () => {
    before(() => {
      pythia.predict(0);
    });
    after(pythia.forget);

    let board;
    Given("a board", () => {
      board = new Board();
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("punching", () => {
      controls.punch();
    });

    And("some time passes", () => {
      board.updateTimer(500);
    });

    Then("timer progress should have advanced", () => {
      expect(board.getTimerProgress()).to.equal(0.90);
    });

    When("pausing", () => {
      controls.pause();
    });

    And("more time passes", () => {
      board.updateTimer(500);
    });

    Then("timer progress should NOT have advanced", () => {
      expect(board.getTimerProgress()).to.equal(0.90);
    });
  });
});
