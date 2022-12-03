import pythia from "the-pythia";

import Particle from "../lib/particle.js";

Feature("Particles", () => {
  before(() => {
    const predictions = {
      size: 0,
      deltaX: 0.3,
      deltaY: 0.8,
    };
    pythia.predict(Object.values(predictions));
  });
  after(pythia.forget);

  Scenario("particle creation and updates", () => {
    let particle;
    When("a particle is created", () => {
      particle = new Particle(100, 200);
    });

    Then("particle should have been initialized correctly", () => {
      expect(particle).to.deep.equal({
        x: 100,
        y: 200,
        size: 0.25,
        rotation: 0,
        deltaX: -100,
        deltaY: -400,
        ttl: 2000,
        timeLeft: 2000,
      });
    });

    And("the remaining life should be full", () => {
      expect(particle.remainingLife()).to.equal(1);
    });

    When("updating the particle", () => {
      particle.update(500);
    });

    Then("particle should have been initialized correctly", () => {
      expect(particle).to.deep.equal({
        x: 50,
        y: 0,
        size: 0.25,
        rotation: -0.1,
        deltaX: -100,
        deltaY: 600,
        ttl: 2000,
        timeLeft: 1500,
      });
    });

    And("the remaining life should be three quarters", () => {
      expect(particle.remainingLife()).to.equal(0.75);
    });

    When("updating the particle again", () => {
      particle.update(500);
    });

    Then("particle should have been initialized correctly", () => {
      expect(particle).to.deep.equal({
        x: 0,
        y: 300,
        size: 0.25,
        rotation: -0.2,
        deltaX: -100,
        deltaY: 1600,
        ttl: 2000,
        timeLeft: 1000,
      });
    });

    And("the remaining life should be half", () => {
      expect(particle.remainingLife()).to.equal(0.5);
    });
  });
});
