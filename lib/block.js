class EditableBlock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default class Block extends EditableBlock {
  constructor(...argv) {
    super(...argv);
    Object.freeze(this);
  }

  clone() {
    return new EditableBlock(this.x, this.y);
  }
}
