import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("Play time", () => {
  Scenario("Pausing and resuming play", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("the game should be playing", () => {
      expect(board.isPlaying()).to.be.true;
    });

    When("time ticks", () => {
      board.update(250);
      board.update(250);
    });

    Then("play time should be updated", () => {
      expect(board.getPlayTime()).to.equal(500);
    });

    When("pausing", () => {
      controls.pause();
    });

    When("time ticks again", () => {
      board.update(250);
      board.update(250);
    });

    Then("play time should not be updated", () => {
      expect(board.getPlayTime()).to.equal(500);
    });
  });
});
