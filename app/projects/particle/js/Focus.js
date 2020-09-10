class Focus {
  constructor(stage, x, y, width, height) {
    this.stage = stage;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.createFocus();
  }

  createFocus() {
    const path = "images/focus.png";
    const texture = PIXI.Texture.fromImage(path);
    this.focus = new PIXI.Sprite(texture);
    this.changeFocusPosition();
    this.stage.addChild(this.focus);
  }

  changeFocusPosition() {
    this.focus.x = this.config.pos.x + this.width / 2 - this.focus.width / 2;
    this.focus.y = this.config.pos.y + this.height / 2 - this.focus.height / 2;
  }

  destroy() {
    this.focus.destroy();
  }
}

export default Focus;
