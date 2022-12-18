import EditableBlock from "./editable-block.js";

export default class AnimatableBlock extends EditableBlock {
  #animations;
  #size;
  #time;

  constructor(x, y, size) {
    super(x, y);
    this.#size = size;
    this.#time = 0;
    this.#animations = [];
    this.offset = {
      x: 0,
      y: 0,
    };
  }

  update(time) {
    const animation = this.#animations[0];
    if (!animation) return;

    this.#time += time;

    if (this.#isAnimationDelayReached(animation)) {
      const animationTime = this.#time - animation.delay;
      const size = this.#size * (animationTime / AnimatableBlock.ANIMATION_DURATION);
      const diffX = (animation.x - this.x || 0) * size;
      const diffY = (animation.y - this.y || 0) * size;
      this.offset.x = diffX;
      this.offset.y = diffY;
    }

    if (this.#isAnimationOver(animation)) {
      const { x, y } = this.#animations.shift();
      this.#reset(x, y);
    }
  }

  addAnimation(delay, coords) {
    this.#animations.push({ delay: delay - AnimatableBlock.ANIMATION_TRIGGER, ...coords });
    return this;
  }

  #isAnimationDelayReached(animation) {
    return this.#time >= animation.delay;
  }

  #isAnimationOver(animation) {
    return this.#time >= animation.delay + AnimatableBlock.ANIMATION_DURATION;
  }

  #reset(x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.offset.x = 0;
    this.offset.y = 0;
  }

  static ANIMATION_DURATION = 100;
  static ANIMATION_TRIGGER = AnimatableBlock.ANIMATION_DURATION / 2;
}
