import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

Feature("Shapes", () => {
  Scenario("available shapes", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });
    let controls;

    And("controls are initialized", () => {
      controls = new Controls(board);
    });

    Object.values(Shape.SHAPES).forEach((_, i, shapes) => {
      const length = shapes.length - i - 1 || shapes.length;
      Then(`available shapes length is ${length}`, () => {
        expect(board.shapes).to.have.lengthOf(length);
      });

      When("dropping shape", () => {
        controls.drop();
      });
    });
  });
});
