import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import Shape from "../lib/shape.js";

Feature("Shapes", () => {
  Scenario("available shapes", () => {
    let board;
    When("a board is created", () => {
      board = new Board(0, 8, 40);
    });

    let controls;
    And("controls are initialized", () => {
      controls = new Controls(board);
    });

    Object.keys(Shape.SHAPES)
      .forEach((_, i, shapes) => {
        const length = shapes.length - 1 - i || shapes.length;
        Then(`available shapes length is ${length}`, () => {
          expect(board.shapes).to.have.lengthOf(length);
        });

        When("punching the shape", () => {
          controls.punch();
        });
      });

    Then("available shapes length is 6 again", () => {
      expect(board.shapes).to.have.lengthOf(6);
    });
  });
});
