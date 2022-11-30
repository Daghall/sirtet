import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

const x = Math.floor(Board.MAX_X / 2);
const y = Math.floor(Board.MAX_Y / 2);

Feature("Rotation", () => {
  let board;
  let controls;

  before(() => {
    board = new Board();
    controls = new Controls(board);
  });

  Scenario("square", () => {
    Given("a square shape", () => {
      board.setShape(new Shape(Shape.SHAPES.SQUARE));
    });

    When("the shape is moved to the middle", () => {
      board.current.moveTo(x, y);
    });

    Then("square should me in the middle, in the first rotation state", () => {
      expect(board.current.toString()).to.deep.equal("square 3:8,3:9,4:8,4:9");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("square should me in the middle, in the first rotation state", () => {
      expect(board.current.toString()).to.deep.equal("square 3:8,3:9,4:8,4:9");
    });
  });

  Scenario("tee", () => {
    Given("a tee shape", () => {
      board.setShape(new Shape(Shape.SHAPES.TEE));
    });

    When("the shape is moved to the middle", () => {
      board.current.moveTo(x, y);
    });

    Then("tee should be in the middle, in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,5:9");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in the second rotation state", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("tee 4:8,4:9,4:10,5:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in the third rotation state", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:9,4:10,5:9");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in the fourth rotation state", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,4:10");
    });

    When("rotating clockwise a fourth time", () => {
      controls.rotateClockwise();
    });

    Then("tee should be in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,5:9");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in the fourth rotation state again", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,4:10");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in the third rotation state again", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:9,4:10,5:9");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in the second rotation state again", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("tee 4:8,4:9,4:10,5:9");
    });

    When("rotating counter clockwise a fourth time", () => {
      controls.rotateCounterClockwise();
    });

    Then("tee should be in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("tee 3:9,4:8,4:9,5:9");
    });
  });

  Scenario("zed", () => {
    Given("a zed shape", () => {
      board.setShape(new Shape(Shape.SHAPES.ZED));
    });

    When("the shape is moved to the middle", () => {
      board.current.moveTo(x, y);
    });

    Then("zed should be in the middle, in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("zed 3:8,4:8,4:9,5:9");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("zed should be in the second rotation state", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("zed 3:9,3:10,4:8,4:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("zed should in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("zed 3:8,4:8,4:9,5:9");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("zed should be in the second rotation state again", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("zed 3:9,3:10,4:8,4:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("zed should be in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("zed 3:8,4:8,4:9,5:9");
    });
  });

  Scenario("line", () => {
    Given("a line shape", () => {
      board.setShape(new Shape(Shape.SHAPES.LINE));
    });

    When("the shape is moved to the middle", () => {
      board.current.moveTo(x, y);
    });

    Then("line should be in the middle, in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("line 4:8,4:9,4:10,4:11");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("line should be in the second rotation state", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("line 3:9,4:9,5:9,6:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("line should in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("line 4:8,4:9,4:10,4:11");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("line should be in the second rotation state again", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("line 3:9,4:9,5:9,6:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("line should be in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("line 4:8,4:9,4:10,4:11");
    });
  });

  Scenario("dez", () => {
    Given("a dez shape", () => {
      board.setShape(new Shape(Shape.SHAPES.DEZ));
    });

    When("the shape is moved to the middle", () => {
      board.current.moveTo(x, y);
    });

    Then("dez should be in the middle, in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("dez 3:9,4:8,4:9,5:8");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("dez should be in the second rotation state", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("dez 3:8,3:9,4:9,4:10");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("dez should in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("dez 3:9,4:8,4:9,5:8");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("dez should be in the second rotation state again", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("dez 3:8,3:9,4:9,4:10");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("dez should be in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("dez 3:9,4:8,4:9,5:8");
    });
  });

  Scenario("ELL", () => {
    Given("an ELL shape", () => {
      board.setShape(new Shape(Shape.SHAPES.ELL));
    });

    When("the shape is moved to the middle", () => {
      board.current.moveTo(x, y);
    });

    Then("ELL should be in the middle, in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("ell 4:8,4:9,4:10,5:8");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the second rotation state", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("ell 3:9,4:9,5:9,5:10");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the third rotation state", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("ell 3:10,4:8,4:9,4:10");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the fourth rotation state", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("ell 3:8,3:9,4:9,5:9");
    });

    When("rotating clockwise a fourth time", () => {
      controls.rotateClockwise();
    });

    Then("ELL should be in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("ell 4:8,4:9,4:10,5:8");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the fourth rotation state again", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("ell 3:8,3:9,4:9,5:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the third rotation state again", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("ell 3:10,4:8,4:9,4:10");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the second rotation state again", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("ell 3:9,4:9,5:9,5:10");
    });

    When("rotating counter clockwise a fourth time", () => {
      controls.rotateCounterClockwise();
    });

    Then("ELL should be in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("ell 4:8,4:9,4:10,5:8");
    });
  });

  Scenario("LLE", () => {
    Given("an LLE shape", () => {
      board.setShape(new Shape(Shape.SHAPES.LLE));
    });

    When("the shape is moved to the middle", () => {
      board.current.moveTo(x, y);
    });

    Then("LLE should be in the middle, in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("lle 3:8,4:8,4:9,4:10");
    });

    When("rotating clockwise", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the second rotation state", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("lle 3:9,3:10,4:9,5:9");
    });

    When("rotating clockwise a second time", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the third rotation state", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("lle 4:8,4:9,4:10,5:10");
    });

    When("rotating clockwise a third time", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the fourth rotation state", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("lle 3:9,4:9,5:8,5:9");
    });

    When("rotating clockwise a fourth time", () => {
      controls.rotateClockwise();
    });

    Then("LLE should be in the first rotation state", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("lle 3:8,4:8,4:9,4:10");
    });

    When("rotating counter clockwise", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the fourth rotation state again", () => {
      expect(board.current.rotationState).to.equal(3);
      expect(board.current.toString()).to.deep.equal("lle 3:9,4:9,5:8,5:9");
    });

    When("rotating counter clockwise a second time", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the third rotation state again", () => {
      expect(board.current.rotationState).to.equal(2);
      expect(board.current.toString()).to.deep.equal("lle 4:8,4:9,4:10,5:10");
    });

    When("rotating counter clockwise a third time", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the second rotation state again", () => {
      expect(board.current.rotationState).to.equal(1);
      expect(board.current.toString()).to.deep.equal("lle 3:9,3:10,4:9,5:9");
    });

    When("rotating counter clockwise a fourth time", () => {
      controls.rotateCounterClockwise();
    });

    Then("LLE should be in the first rotation state again", () => {
      expect(board.current.rotationState).to.equal(0);
      expect(board.current.toString()).to.deep.equal("lle 3:8,4:8,4:9,4:10");
    });
  });
});
