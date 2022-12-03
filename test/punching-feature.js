import pythia from "the-pythia";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("Punching", () => {
  Scenario("punching shapes", () => {
    const events = [];
    before(() => {
      pythia.predict(0);
    });
    after(pythia.forget);

    let board;
    When("a board is created", () => {
      board = new Board();
    });

    And("punch events are listened for", () => {
      board.on("punch", (event) => {
        events.push(event);
      });
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
      board.die.moveTo(x, y);
    });

    Then("SQUARE should be in the middle, in first rotation state", () => {
      expect(board.die.rotationState).to.equal(0);
      expect(board.die.toString()).to.deep.equal("SQUARE 0:16,0:17,1:16,1:17");
    });

    When("punching the shape", () => {
      controls.punch();
    });

    Then("the SQUARE should be gone", () => {
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

    And("there should have been four events emitted, in total", () => {
      expect(events).to.have.deep.equal([
        { x: 1, y: 17 },
        { x: 0, y: 16 },
        { x: 0, y: 17 },
        { x: 1, y: 16 },
      ]);
    });

    When("moving the shape to the right", () => {
      controls.right();
      controls.right();
    });

    And("punching the shape", () => {
      controls.punch();
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

    And("there should have been eight events emitted, in total", () => {
      expect(events).to.have.lengthOf(8);
    });

    When("moving the shape down", () => {
      controls.down();
      controls.down();
    });

    And("punching the shape", () => {
      controls.punch();
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

    And("there should have been 12 events emitted, in total", () => {
      expect(events).to.have.lengthOf(12);
    });

    When("rotating the line", () => {
      controls.rotateClockwise();
    });

    When("punching the shape", () => {
      controls.punch();
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

    And("there should have been 13 events emitted, in total", () => {
      expect(events).to.have.lengthOf(13);
    });
  });
});
