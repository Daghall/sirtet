import pythia from "the-pythia";
import { expect } from "chai";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";

Feature("Level", () => {
  Scenario("level up", () => {
    const events = [];
    before(() => {
      pythia.predict(0);
    });
    after(pythia.forget);

    let board;
    When("a board is created", () => {
      board = new Board();
    });

    And("a gap in the board", () => {
      board.setBoard([
        [ 1, 1, 0, 1, 0 ],
        [ 1, 1, 1, 1, 0 ],
        [ 0, 0, 0, 1, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
      ]);
    });

    And("level up is imminent", () => {
      board.experience = 9;
    });

    let controls;
    And("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("punch events are listened for", () => {
      board.on("punch", (event) => {
        events.push(event);
      });
    });

    Then("the level should be one", () => {
      expect(board).to.have.property("level", 1);
    });

    When("punching", () => {
      controls.punch();
    });

    Then("the level should be two", () => {
      expect(board).to.have.property("level", 2);
    });

    And("the experience should have wrapped back to one", () => {
      expect(board).to.have.property("experience", 1);
    });

    And("a punch should have been made", () => {
      expect(events).to.have.lengthOf(4);
    });

    When("moving the die", () => {
      controls.down();
      controls.down();
    });

    And("the level's time limit is exceeded", () => {
      board.update(4801);
    });

    Then("an auto-punch should have happened", () => {
      expect(events).to.have.lengthOf(8);
    });
  });
});
