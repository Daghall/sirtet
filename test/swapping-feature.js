import { expect } from "chai";
import pythia from "the-pythia";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

Feature("Swapping", () => {
  before(() => {
    pythia.predict(0);
  });
  after(pythia.forget);

  Scenario("holding/swapping shape", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("the die is in the middle", () => {
      board.die.moveTo(4, 9);
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    Then("hold should be empty", () => {
      expect(board.hold).to.be.null;
    });

    When("moving the die", () => {
      controls.up();
      controls.left();
    });

    Then("the die should be moved", () => {
      expect(board.die.x).to.equal(3);
      expect(board.die.y).to.equal(8);
    });

    When("swapping shapes", () => {
      controls.swapShape();
    });

    Then("hold should contain a SQUARE", () => {
      expect(board.hold.name).to.equal(Shape.SHAPES.SQUARE);
    });

    And("its position should be reset", () => {
      expect(board.hold.x).to.equal(0);
      expect(board.hold.y).to.equal(0);
    });

    And("current die should be a TEE", () => {
      expect(board.die.name).to.equal(Shape.SHAPES.TEE);
    });

    And("the die should be at the same coordinates as the previous die", () => {
      expect(board.die.x).to.equal(3);
      expect(board.die.y).to.equal(8);
    });

    When("trying to swap again", () => {
      controls.swapShape();
    });

    Then("hold should still contain a SQUARE", () => {
      expect(board.hold.name).to.equal(Shape.SHAPES.SQUARE);
    });

    And("current die should still be a TEE", () => {
      expect(board.die.name).to.equal(Shape.SHAPES.TEE);
    });

    When("punching the TEE", () => {
      controls.punch();
    });

    Then("current die should be a ZED", () => {
      expect(board.die.name).to.equal(Shape.SHAPES.ZED);
    });

    When("moving and rotating the die", () => {
      controls.up();
      controls.left();
      controls.rotateClockwise();
    });

    Then("the die should be moved and rotated", () => {
      expect(board.die.x).to.equal(2);
      expect(board.die.y).to.equal(7);
      expect(board.die.rotationState).to.equal(1);
    });

    When("swapping shapes", () => {
      controls.swapShape();
    });

    Then("hold should contain a ZED", () => {
      expect(board.hold.name).to.equal(Shape.SHAPES.ZED);
    });

    And("it should be reset to default rotation", () => {
      expect(board.hold.rotationState).to.equal(0);
    });

    And("current die should be a SQUARE", () => {
      expect(board.die.name).to.equal(Shape.SHAPES.SQUARE);
    });

    And("the die should be at the same coordinates as the previous die", () => {
      expect(board.die.x).to.equal(2);
      expect(board.die.y).to.equal(7);
    });

    When("trying to swap again", () => {
      controls.swapShape();
    });

    Then("hold should still contain a ZED", () => {
      expect(board.hold.name).to.equal(Shape.SHAPES.ZED);
    });

    Then("current die should be still be a SQUARE", () => {
      expect(board.die.name).to.equal(Shape.SHAPES.SQUARE);
    });
  });
});
