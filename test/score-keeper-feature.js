import { expect } from "chai";
import pythia from "the-pythia";

import Board from "../lib/board.js";
import Controls from "../lib/controls.js";
import ScoreKeeper from "../lib/score-keeper.js";

Feature("Score keeper", () => {
  [
    { name: "one line", linesCleared: 1, score: 100 },
    { name: "two lines", linesCleared: 2, score: 250 },
    { name: "three lines", linesCleared: 3, score: 400 },
    { name: "four lines", linesCleared: 4, score: 600 },
  ].forEach(({ name, linesCleared, score }) => {
    Scenario(`scoring ${name}`, () => {
      let board;
      Given("a board", () => {
        board = new Board();
      });

      let scoreKeeper;
      And("a score keeper", () => {
        scoreKeeper = new ScoreKeeper(board);
      });

      When("\"line cleared\" is emitted", () => {
        board.emit("line cleared", linesCleared);
      });

      Then(`the player should be awarded ${score} points`, () => {
        expect(scoreKeeper.getBuffered()).to.equal(score);
      });
    });
  });

  Scenario("only lines where blocks were actually removed should score points", () => {
    before(() => {
      pythia.predict(0);
    });
    after(pythia.forget);

    let board;
    Given("a board", () => {
      board = new Board();
    });

    And("a gap in the board", () => {
      board.setBoard([
        [ 0, 1, 1, 1 ],
        [ 0, 1, 1, 1 ],
        [ 0, 0, 1, 1 ],
        [ 0, 0, 1, 1 ],
      ]);
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board);
    });

    When("the SQUARE is moved to the top", () => {
      board.die.moveTo(0, 1);
    });

    Then("the SQUARE is in position", () => {
      expect(board.toString({ showShape: true })).to.equal([
        "2311",
        "2311",
        "0011",
        "0011",
      ].join("\n"));
    });

    let controls;
    When("controls are initialized", () => {
      controls = new Controls(board);
    });

    And("punching", () => {
      controls.punch();
    });

    Then("a single line of score is awarded", () => {
      expect(scoreKeeper.getBuffered()).to.equal(100);
    });
  });

  Scenario("full clear", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board);
    });

    When("\"full clear\" is emitted", () => {
      board.emit("full clear");
    });

    Then("the player should be awarded 1000 points", () => {
      expect(scoreKeeper.getBuffered()).to.equal(1000);
    });
  });

  Scenario("updating score", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board);
    });

    When("\"line cleared\" is emitted", () => {
      board.emit("line cleared", 1);
    });

    Then("the player should be awarded points", () => {
      expect(scoreKeeper.getBuffered()).to.equal(100);
    });

    When("updating", () => {
      scoreKeeper.update(33); // 30 FPS
    });

    Then("score should be transferred to the bank", () => {
      expect(scoreKeeper.getScore()).to.equal(33);
      expect(scoreKeeper.getBuffered()).to.equal(67);
    });

    When("updating again", () => {
      scoreKeeper.update(33);
    });

    Then("score should be transferred to the bank again", () => {
      expect(scoreKeeper.getScore()).to.equal(56);
      expect(scoreKeeper.getBuffered()).to.equal(44);
    });

    When("updating a long time", () => {
      scoreKeeper.update(100);
    });

    Then("the rest of score should be transferred to the bank", () => {
      expect(scoreKeeper.getScore()).to.equal(100);
      expect(scoreKeeper.getBuffered()).to.equal(0);
    });

    When("updating yet again", () => {
      scoreKeeper.update(33);
    });

    Then("no score change should have happened", () => {
      expect(scoreKeeper.getScore()).to.equal(100);
      expect(scoreKeeper.getBuffered()).to.equal(0);
    });
  });

  Scenario("statistics", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board);
    });

    When("one line cleared is emitted thrice", () => {
      board.emit("line cleared", 1);
      board.emit("line cleared", 1);
      board.emit("line cleared", 1);
    });

    And("two lines cleared is emitted twice", () => {
      board.emit("line cleared", 2);
      board.emit("line cleared", 2);
    });

    And("three lines cleared is emitted", () => {
      board.emit("line cleared", 3);
    });

    And("four lines cleared is emitted", () => {
      board.emit("line cleared", 4);
    });

    And("full clear is emitted", () => {
      board.emit("full clear");
    });

    Then("statistics are updated", () => {
      expect(scoreKeeper.getStats()).to.deep.equal({
        ones: 3,
        twos: 2,
        threes: 1,
        fours: 1,
        fullClears: 1,
      });
    });
  });
});
