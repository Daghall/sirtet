import pythia from "the-pythia";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("Dropping", () => {
  Scenario("dropping shapes", () => {
    before(() => {
      pythia.predict(0);
    });
    after(pythia.forget);

    let board;
    When("a board is created", () => {
      board = new Board();
    });

    Then("the bottom four rows should be filled", () => {
      expect(board.toString()).to.equal([
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("shape is moved to top of the bricks", () => {
      const x = 0;
      const y = Board.MAX_Y - 2;
      board.current.moveTo(x, y);
    });

    Then("square should be in the middle, in first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("square 0:16,0:17,1:16,1:17");
    });

    When("dropping the shape", () => {
      controls.drop();
    });

    Then("the square should be gone", () => {
      expect(board.toString()).to.equal([
        "00000000000000000011",
        "00000000000000000011",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
      ].join("\n"));
    });

    When("moving the shape to the right", () => {
      controls.right();
      controls.right();
    });

    And("dropping the shape", () => {
      controls.drop();
    });

    Then("the tee should be gone", () => {
      expect(board.toString()).to.equal([
        "00000000000000000011",
        "00000000000000000011",
        "00000000000000001011",
        "00000000000000000011",
        "00000000000000001011",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
      ].join("\n"));
    });

    When("moving the shape down", () => {
      controls.down();
      controls.down();
    });

    And("dropping the shape", () => {
      controls.drop();
    });

    Then("the zed should be gone", () => {
      expect(board.toString()).to.equal([
        "00000000000000000011",
        "00000000000000000011",
        "00000000000000001001",
        "00000000000000000000",
        "00000000000000001010",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
        "00000000000000001111",
      ].join("\n"));
    });

    When("rotating the line", () => {
      controls.rotateClockwise();
    });

    When("dropping the shape", () => {
      controls.drop();
    });

    Then("the line should be gone, and three penalty lines should be added", () => {
      expect(board.toString()).to.equal([
        "00000000000000011111",
        "00000000000000011111",
        "00000000000001001111",
        "00000000000000000111",
        "00000000000001010111",
        "00000000000001011111",
        "00000000000001111111",
        "00000000000001111111",
        "00000000000001111111",
        "00000000000001111111",
      ].join("\n"));
    });
  });
});
