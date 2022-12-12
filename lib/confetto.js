import Particle from "./particle.js";

export default class Confetto extends Particle {
  constructor(x, y, direction, id) {
    super(x, y);
    this.id = id;
    switch (direction) {
      case Confetto.DIRECTION_LEFT:
        this.deltaX = Math.random() * -500;
        break;

      case Confetto.DIRECTION_RIGHT:
        this.deltaX = Math.random() * 500;
        break;
    }
    this.deltaY = Math.random() * -500 - 1000;
  }

  update(time) {
    const timeFactor = time / 1000;
    super.update(time);
    this.x += this.deltaX * timeFactor;
    this.deltaX /= 1.05;
  }

  remainingLife() {
    return this.timeLeft / this.ttl;
  }

  static DIRECTION_LEFT = "left";
  static DIRECTION_RIGHT = "right";
}
