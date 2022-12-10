import { expect } from "chai";
import ck from "chronokinesis";

import Board from "../lib/board.js";
import ScoreKeeper from "../lib/score-keeper.js";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

Feature("High score", () => {
  beforeEachScenario(() => {
    ck.freeze("2022-12-09 12:00:00");
  });
  afterEachScenario(() => {
    ck.reset();
  });

  Scenario("no previous high score", () => {

    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board);
    });

    When("player scores", () => {
      board.emit("line cleared", 1);
    });

    And("the score is updated", () => {
      scoreKeeper.update(600);
    });

    And("the player dies", () => {
      board.isPlaying = false;
      board.emit("death");
    });

    And("the score is updated", () => {
      scoreKeeper.update(1000);
    });

    Then("the score should be added to the high score list", () => {
      expect(scoreKeeper.getHighScores()).to.deep.equal([ {
        date: Date.now(),
        score: 100,
        place: 1,
      } ]);
    });
  });

  Scenario("existing score, and tied for first place", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board, [
        createScoreObject(1000, 1),
        createScoreObject(500, 3),
        createScoreObject(500, 2),
        createScoreObject(250, 2),
      ]);
    });

    When("player scores", () => {
      board.emit("full clear");
    });

    And("the score is updated", () => {
      scoreKeeper.update(600);
    });

    And("the player dies", () => {
      board.isPlaying = false;
      board.emit("death");
    });

    And("the score is updated", () => {
      scoreKeeper.update(1000);
    });

    Then("the score should be added to the high score list", () => {
      expect(scoreKeeper.getHighScores()).to.deep.equal([
        {
          date: new Date("2022-12-09T11:00:00Z").getTime(),
          score: 1000,
          place: 1,
        },
        {
          date: new Date("2022-12-08T11:00:00Z").getTime(),
          score: 1000,
          place: 1,
        },
        {
          date: new Date("2022-12-07T11:00:00Z").getTime(),
          score: 500,
          place: 3,
        },
        {
          date: new Date("2022-12-06T11:00:00Z").getTime(),
          score: 500,
          place: 3,
        },
        {
          date: new Date("2022-12-07T11:00:00Z").getTime(),
          score: 250,
          place: 5,
        },
      ]);
    });
  });

  Scenario("new high score, list is full", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board, [
        createScoreObject(1000, 1),
        createScoreObject(500, 3),
        createScoreObject(500, 2),
        createScoreObject(250, 2),
        createScoreObject(250, 3),
        createScoreObject(250, 4),
        createScoreObject(250, 5),
        createScoreObject(250, 6),
        createScoreObject(250, 7),
        createScoreObject(250, 8),
      ]);
    });

    When("player scores", () => {
      board.emit("full clear");
    });

    And("the score is updated", () => {
      scoreKeeper.update(600);
    });

    And("the player dies", () => {
      board.isPlaying = false;
      board.emit("death");
    });

    And("the score is updated", () => {
      scoreKeeper.update(1000);
    });

    Then("the score should be added to the high score list", () => {
      const highScores = scoreKeeper.getHighScores();
      expect(highScores).to.have.lengthOf(10);
      expect(highScores).to.deep.equal([
        {
          date: new Date("2022-12-09T11:00:00Z").getTime(),
          score: 1000,
          place: 1,
        },
        {
          date: new Date("2022-12-08T11:00:00Z").getTime(),
          score: 1000,
          place: 1,
        },
        {
          date: new Date("2022-12-07T11:00:00Z").getTime(),
          score: 500,
          place: 3,
        },
        {
          date: new Date("2022-12-06T11:00:00Z").getTime(),
          score: 500,
          place: 3,
        },
        {
          date: new Date("2022-12-07T11:00:00Z").getTime(),
          score: 250,
          place: 5,
        },
        {
          date: new Date("2022-12-06T11:00:00Z").getTime(),
          score: 250,
          place: 5,
        },
        {
          date: new Date("2022-12-05T11:00:00Z").getTime(),
          score: 250,
          place: 5,
        },
        {
          date: new Date("2022-12-04T11:00:00Z").getTime(),
          score: 250,
          place: 5,
        },
        {
          date: new Date("2022-12-03T11:00:00Z").getTime(),
          score: 250,
          place: 5,
        },
        {
          date: new Date("2022-12-02T11:00:00Z").getTime(),
          score: 250,
          place: 5,
        },
      ]);
    });
  });

  Scenario("no new high score, list in full", () => {

    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper", () => {
      scoreKeeper = new ScoreKeeper(board, [
        createScoreObject(1000, 1),
        createScoreObject(500, 3),
        createScoreObject(500, 2),
        createScoreObject(250, 2),
        createScoreObject(250, 3),
        createScoreObject(250, 4),
        createScoreObject(250, 5),
        createScoreObject(250, 6),
        createScoreObject(250, 7),
        createScoreObject(250, 8),
      ]);
    });

    When("player scores", () => {
      board.emit("line cleared", 1);
    });

    And("the score is updated", () => {
      scoreKeeper.update(600);
    });

    And("the player dies", () => {
      board.isPlaying = false;
      board.emit("death");
    });

    And("the score is updated", () => {
      scoreKeeper.update(1000);
    });

    Then("the score should note have been added to the high score list", () => {
      const highScores = scoreKeeper.getHighScores();
      expect(highScores).to.have.lengthOf(10);
      expect(highScores).to.deep.equal([
        {
          date: new Date("2022-12-08T11:00:00Z").getTime(),
          score: 1000,
          place: 1,
        },
        {
          date: new Date("2022-12-07T11:00:00Z").getTime(),
          score: 500,
          place: 2,
        },
        {
          date: new Date("2022-12-06T11:00:00Z").getTime(),
          score: 500,
          place: 2,
        },
        {
          date: new Date("2022-12-07T11:00:00Z").getTime(),
          score: 250,
          place: 4,
        },
        {
          date: new Date("2022-12-06T11:00:00Z").getTime(),
          score: 250,
          place: 4,
        },
        {
          date: new Date("2022-12-05T11:00:00Z").getTime(),
          score: 250,
          place: 4,
        },
        {
          date: new Date("2022-12-04T11:00:00Z").getTime(),
          score: 250,
          place: 4,
        },
        {
          date: new Date("2022-12-03T11:00:00Z").getTime(),
          score: 250,
          place: 4,
        },
        {
          date: new Date("2022-12-02T11:00:00Z").getTime(),
          score: 250,
          place: 4,
        },
        {
          date: new Date("2022-12-01T11:00:00Z").getTime(),
          score: 250,
          place: 4,
        },
      ]);
    });
  });

  Scenario("new score with no previous high scores", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper with no high scores", () => {
      scoreKeeper = new ScoreKeeper(board, []);
    });

    When("user scores", () => {
      board.emit("line cleared", 1);
    });

    And("the score is updated", () => {
      scoreKeeper.update(1000);
    });

    And("user dies", () => {
      board.emit("death");
    });

    Then("there should be a new high score", () => {
      expect(scoreKeeper.isNewHighScore()).to.equal(true);
    });
  });

  Scenario("new high score with a previous equally high score", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper with high scores", () => {
      scoreKeeper = new ScoreKeeper(board, [
        createScoreObject(100),
      ]);
    });

    When("user scores", () => {
      board.emit("line cleared", 1);
    });

    And("the score is updated", () => {
      scoreKeeper.update(1000);
    });

    And("user dies", () => {
      board.emit("death");
    });

    Then("there should be a new high score", () => {
      expect(scoreKeeper.isNewHighScore()).to.equal(true);
    });
  });

  Scenario("new high score with a previous higher score", () => {
    let board;
    Given("a board", () => {
      board = new Board();
    });

    let scoreKeeper;
    And("a score keeper with high scores", () => {
      scoreKeeper = new ScoreKeeper(board, [
        createScoreObject(200),
      ]);
    });

    When("user scores", () => {
      board.emit("line cleared", 1);
    });

    And("the score is updated", () => {
      scoreKeeper.update(1000);
    });

    And("user dies", () => {
      board.emit("death");
    });

    Then("there should not be a new high score", () => {
      expect(scoreKeeper.isNewHighScore()).to.equal(false);
    });
  });
});

function createScoreObject(score, dayOffset = 0) {
  return {
    date: Date.now() - ONE_DAY_IN_MS * dayOffset,
    score,
  };
}
