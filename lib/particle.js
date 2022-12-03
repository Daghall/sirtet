export default class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 0.25 + 0.25;
    this.deltaX = Math.random() * 500 - 250;
    this.deltaY = Math.random() * -500;
    this.rotation = 0;
    this.ttl = 2000;
    this.timeLeft = 2000;
  }

  update(time) {
    const timeFactor = time / 1000;
    this.timeLeft -= time;
    this.x += this.deltaX * timeFactor;
    this.y += this.deltaY * timeFactor;
    this.rotation += this.deltaX / 1000;
    this.deltaY += timeFactor * 2000;
  }

  remainingLife() {
    return this.timeLeft / this.ttl;
  }
}
