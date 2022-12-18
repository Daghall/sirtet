import EditableBlock from "./editable-block.js";

export default class Block extends EditableBlock {
  constructor(...argv) {
    super(...argv);
    Object.freeze(this);
  }

  clone() {
    return new EditableBlock(this.x, this.y);
  }
}
