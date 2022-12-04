import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

Feature("Rotation", () => {
  let board;
  let controls;

  before(() => {
    board = new Board();
    controls = new Controls(board);
  });

  Scenario("SQUARE", () => {
    Given("a SQUARE shape", () => {
      board.setShape(new Shape(Shape.SHAPES.SQUARE));
    });

    When("the shape is moved to the middle", () => {
      board.die.moveTo(4, 9);
    });

    Then("SQUARE should me in the middle, in the first rotation state", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 3:8,3:9,4:8,4:9");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("SQUARE should me in the middle, in the first rotation state", () => {
      expect(board.die.toString()).to.deep.equal("SQUARE 3:8,3:9,4:8,4:9");
    });
  });

  Scenario("TEE", () => {
    Given("a TEE shape", () => {
      board.setShape(new Shape(Shape.SHAPES.TEE));
    });

    When("the shape is moved to the middle", () => {
      board.die.moveTo(4, 9);
    });

    Then("TEE should be in the middle, in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("TEE 3:9,4:8,4:9,5:9");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("TEE should be in the second rotation state", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("TEE 4:8,4:9,4:10,5:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("TEE should be in the third rotation state", () => {
      expect(board.die.rotationState).to.equal(2);
      expect(board.die.toString()).to.deep.equal("TEE 3:9,4:9,4:10,5:9");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("TEE should be in the fourth rotation state", () => {
      expect(board.die.rotationState).to.equal(3);
      expect(board.die.toString()).to.deep.equal("TEE 3:9,4:8,4:9,4:10");
    });

    When("rotating clockwise a fourth time", () => {
      controls.rotateClockwise();
    });

    Then("TEE should be in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("TEE 3:9,4:8,4:9,5:9");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("TEE should be in the fourth rotation state again", () => {
      expect(board.die.rotationState).to.equal(3);
      expect(board.die.toString()).to.deep.equal("TEE 3:9,4:8,4:9,4:10");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("TEE should be in the third rotation state again", () => {
      expect(board.die.rotationState).to.equal(2);
      expect(board.die.toString()).to.deep.equal("TEE 3:9,4:9,4:10,5:9");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("TEE should be in the second rotation state again", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("TEE 4:8,4:9,4:10,5:9");
    });

    When("rotating counter clockwise a fourth time", () => {
      controls.rotateCounterClockwise();
    });

    Then("TEE should be in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("TEE 3:9,4:8,4:9,5:9");
    });
  });

  Scenario("ZED", () => {
    Given("a ZED shape", () => {
      board.setShape(new Shape(Shape.SHAPES.ZED));
    });

    When("the shape is moved to the middle", () => {
      board.die.moveTo(4, 9);
    });

    Then("ZED should be in the middle, in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("ZED 3:8,4:8,4:9,5:9");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("ZED should be in the second rotation state", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("ZED 3:9,3:10,4:8,4:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("ZED should in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("ZED 3:8,4:8,4:9,5:9");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("ZED should be in the second rotation state again", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("ZED 3:9,3:10,4:8,4:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("ZED should be in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("ZED 3:8,4:8,4:9,5:9");
    });
  });

  Scenario("LINE", () => {
    Given("a LINE shape", () => {
      board.setShape(new Shape(Shape.SHAPES.LINE));
    });

    When("the shape is moved to the middle", () => {
      board.die.moveTo(4, 9);
    });

    Then("LINE should be in the middle, in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("LINE 4:8,4:9,4:10,4:11");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("LINE should be in the second rotation state", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("LINE 3:9,4:9,5:9,6:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("LINE should in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("LINE 4:8,4:9,4:10,4:11");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("LINE should be in the second rotation state again", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("LINE 3:9,4:9,5:9,6:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("LINE should be in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("LINE 4:8,4:9,4:10,4:11");
    });
  });

  Scenario("DEZ", () => {
    Given("a DEZ shape", () => {
      board.setShape(new Shape(Shape.SHAPES.DEZ));
    });

    When("the shape is moved to the middle", () => {
      board.die.moveTo(4, 9);
    });

    Then("DEZ should be in the middle, in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("DEZ 3:9,4:8,4:9,5:8");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("DEZ should be in the second rotation state", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("DEZ 3:8,3:9,4:9,4:10");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("DEZ should in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("DEZ 3:9,4:8,4:9,5:8");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("DEZ should be in the second rotation state again", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("DEZ 3:8,3:9,4:9,4:10");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("DEZ should be in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("DEZ 3:9,4:8,4:9,5:8");
    });
  });

  Scenario("ELL", () => {
    Given("an ELL shape", () => {
      board.setShape(new Shape(Shape.SHAPES.ELL));
    });

    When("the shape is moved to the middle", () => {
      board.die.moveTo(4, 9);
    });

    Then("ELL should be in the middle, in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("ELL 4:8,4:9,4:10,5:8");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the second rotation state", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("ELL 3:9,4:9,5:9,5:10");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the third rotation state", () => {
      expect(board.die.rotationState).to.equal(2);
      expect(board.die.toString()).to.deep.equal("ELL 3:10,4:8,4:9,4:10");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the fourth rotation state", () => {
      expect(board.die.rotationState).to.equal(3);
      expect(board.die.toString()).to.deep.equal("ELL 3:8,3:9,4:9,5:9");
    });

    When("rotating clockwise a fourth time", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("ELL 4:8,4:9,4:10,5:8");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the fourth rotation state again", () => {
      expect(board.die.rotationState).to.equal(3);
      expect(board.die.toString()).to.deep.equal("ELL 3:8,3:9,4:9,5:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the third rotation state again", () => {
      expect(board.die.rotationState).to.equal(2);
      expect(board.die.toString()).to.deep.equal("ELL 3:10,4:8,4:9,4:10");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the second rotation state again", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("ELL 3:9,4:9,5:9,5:10");
    });

    When("rotating counter clockwise a fourth time", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("ELL 4:8,4:9,4:10,5:8");
    });
  });

  Scenario("LLE", () => {
    Given("an LLE shape", () => {
      board.setShape(new Shape(Shape.SHAPES.LLE));
    });

    When("the shape is moved to the middle", () => {
      board.die.moveTo(4, 9);
    });

    Then("LLE should be in the middle, in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("LLE 3:8,4:8,4:9,4:10");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the second rotation state", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("LLE 3:9,3:10,4:9,5:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the third rotation state", () => {
      expect(board.die.rotationState).to.equal(2);
      expect(board.die.toString()).to.deep.equal("LLE 4:8,4:9,4:10,5:10");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the fourth rotation state", () => {
      expect(board.die.rotationState).to.equal(3);
      expect(board.die.toString()).to.deep.equal("LLE 3:9,4:9,5:8,5:9");
    });

    When("rotating clockwise a fourth time", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("LLE 3:8,4:8,4:9,4:10");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the fourth rotation state again", () => {
      expect(board.die.rotationState).to.equal(3);
      expect(board.die.toString()).to.deep.equal("LLE 3:9,4:9,5:8,5:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the third rotation state again", () => {
      expect(board.die.rotationState).to.equal(2);
      expect(board.die.toString()).to.deep.equal("LLE 4:8,4:9,4:10,5:10");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the second rotation state again", () => {
      expect(board.die.rotationState).to.equal(1);
      expect(board.die.toString()).to.deep.equal("LLE 3:9,3:10,4:9,5:9");
    });

    When("rotating counter clockwise a fourth time", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the first rotation state again", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("LLE 3:8,4:8,4:9,4:10");
    });
  });
});
