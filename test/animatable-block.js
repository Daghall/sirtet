import { expect } from "chai";

import AnimatableBlock from "../lib/animatable-block.js";

const blockSize = 10;

Feature("Animatable blocks", () => {
  Scenario("", () => {
    let block;
    Given("an animatable block", () => {
      block = new AnimatableBlock(0, 0, blockSize);
    });

    When("an animation is added", () => {
      block.addAnimation(1000, { x: 1 });
    });

    Then("the block's offset should be zero", () => {
      expect(block).to.have.nested.property("offset.x", 0);
      expect(block).to.have.nested.property("offset.y", 0);
    });

    When("a lot of time passes", () => {
      block.update(949);
    });

    Then("the block's offset should still be zero", () => {
      expect(block).to.have.nested.property("offset.x", 0);
      expect(block).to.have.nested.property("offset.y", 0);
    });

    When("a little time passes", () => {
      block.update(51);
    });

    Then("the block's offset should be changed", () => {
      expect(block).to.have.nested.property("offset.x", 5);
      expect(block).to.have.nested.property("offset.y", 0);
    });

    When("a little more time passes", () => {
      block.update(49);
    });

    Then("the offset should almost be full", () => {
      expect(block).to.have.nested.property("offset.x", 9.9);
      expect(block).to.have.nested.property("offset.y", 0);
    });

    When("a millisecond passes", () => {
      block.update(1);
    });

    Then("the offset should reset", () => {
      expect(block).to.have.nested.property("offset.x", 0);
      expect(block).to.have.nested.property("offset.y", 0);
    });

    And("the block's coordinates should have been updated", () => {
      expect(block.x).to.equal(1);
      expect(block.y).to.equal(0);
    });
  });
});
