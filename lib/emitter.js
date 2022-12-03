export default class Emitter {
  constructor() {
    this.listeners = {};
  }

  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  emit(eventName, event) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => {
        callback(event);
      });
    }
  }
}
