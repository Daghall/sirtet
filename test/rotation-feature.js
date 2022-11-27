import pythia from "the-pythia";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("Rotation", () => {
  before(() => {
    pythia.predict(0);
  });
  after(pythia.forget);

  Scenario("rotate tee", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("a tee block in the middle", () => {
      const x = Math.floor(Board.MAX_X / 2);
      const y = Math.floor(Board.MAX_Y / 2);
      board.current.moveTo(x, y);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("next shape is used", () => {
      board.nextShape();
    });

    Then("tee should be in the middle, in first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,5:9");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in second rotation state", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("tee 4:8,4:9,4:10,5:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in third rotation state", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:9,4:10,5:9");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in fourth rotation state", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,4:10");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,5:9");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in fourth rotation state again", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,4:10");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in third rotation state again", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:9,4:10,5:9");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in second rotation state again", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("tee 4:8,4:9,4:10,5:9");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,5:9");
    });
  });
});
