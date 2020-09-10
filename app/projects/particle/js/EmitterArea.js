import fields from "./fields.js";

class EmitterArea {
  constructor(target, stage, width, height, config) {
    this.stage = stage;
    this.width = width;
    this.height = height;
    this.target = target;
    this.config = config;
    this.xPos = this.config.pos.x;
    this.yPos = this.config.pos.y;
    this.boxsize = 200;

    this.createEmitterArea(this.xPos, this.yPos);
    this.eventsHandler();
  }

  createEmitterArea(xPos, yPos) {
    switch (this.target) {
      case "rect":
        this.createRectangleArea(xPos, yPos);
        this.handleRectangle();
        break;
      case "circle":
        this.createCircleArea(xPos, yPos);
        this.handleCircle();
        break;
      case "ring":
        this.createRingArea(xPos, yPos);
        break;
    }
  }

  createRectangleArea(xPos, yPos) {
    if (this.graphics) {
      this.graphics.destroy();
    }
    const rectOptions = fields.emissionRectangle;
    let x = +rectOptions.querySelector(".x").value;
    let y = +rectOptions.querySelector(".y").value;
    const w = +rectOptions.querySelector(".w").value;
    const h = +rectOptions.querySelector(".h").value;

    x = x + this.width / 2 - w / 2 + xPos;
    y = y + this.height / 2 - h / 2 + yPos;

    this.graphics = new PIXI.Graphics();

    this.graphics.beginFill(0xff3300, 0.5);
    this.graphics.drawRect(x, y, w, h);
    this.graphics.endFill();
    this.graphics.visible = fields.emitterArea.checked;
    this.stage.addChild(this.graphics);
  }

  handleRectangle() {
    var cv = document.querySelector(".emissionRectangle .set_pos");
    const w = +document.querySelector(".emissionRectangle .w").value;
    const h = +document.querySelector(".emissionRectangle .h").value;

    var emit_ctx = cv.getContext("2d");
    cv.setAttribute("width", this.boxsize);
    cv.setAttribute("height", this.boxsize);
    emit_ctx.scale(1, 1);
    this.drawRectArea(w / 2, h / 2, emit_ctx);
  }

  updateRectangle(e, ctx) {
    const w = document.querySelector(".emissionRectangle .w");
    const h = document.querySelector(".emissionRectangle .h");
    let rect = e.target.getBoundingClientRect();
    let emit_x = Math.abs(e.clientX - rect.left - this.boxsize / 2) * 5;
    let emit_y = Math.abs(e.clientY - rect.top - this.boxsize / 2) * 5;

    this.drawRectArea(emit_x, emit_y, ctx);
    this.createRectangleArea(this.xPos, this.yPos);
    w.value = emit_x * 2;
    h.value = emit_y * 2;
  }

  drawRectArea(xx, yy, emit_ctx) {
    xx = Math.floor(xx);
    yy = Math.floor(yy);

    //四角を描く
    emit_ctx.clearRect(0, 0, this.boxsize, this.boxsize);
    emit_ctx.beginPath();
    emit_ctx.strokeStyle = "rgb(255,88,88)";
    emit_ctx.strokeRect(
      this.boxsize / 2 - Math.floor(xx / 5),
      this.boxsize / 2 - Math.floor(yy / 5),
      Math.floor(xx / 5) * 2,
      Math.floor(yy / 5) * 2
    );
    emit_ctx.closePath();
    emit_ctx.stroke();
  }

  drawCircleArea(xx, yy, emit_ctx) {
    const w = document.querySelector(".emissionRectangle .w");
    const h = document.querySelector(".emissionRectangle .h");
    xx = Math.floor(xx);
    yy = Math.floor(yy);

    //四角を描く
    emit_ctx.clearRect(0, 0, this.boxsize, this.boxsize);
    emit_ctx.beginPath();
    emit_ctx.strokeStyle = "rgb(255,88,88)";
    emit_ctx.arc(
      this.boxsize / 2,
      this.boxsize / 2,
      Math.floor(xx / 5) * 2,
      0,
      2 * Math.PI
    );
    emit_ctx.closePath();
    emit_ctx.stroke();

    w.value = xx * 4;
    h.value = yy * 2;
  }

  createCircleArea(xPos, yPos) {
    const circleOptions = fields.emissionCircle;

    let x = +circleOptions.querySelector(".x").value;
    let y = +circleOptions.querySelector(".y").value;
    let r = +circleOptions.querySelector(".r").value;

    x = x + this.width / 2 + xPos;
    y = y + this.height / 2 + yPos;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff3300, 0.5);
    this.graphics.drawCircle(x, y, r);
    this.graphics.endFill();
    this.graphics.visible = fields.emitterArea.checked;
    this.stage.addChild(this.graphics);
  }

  handleCircle() {}

  createRingArea(xPos, yPos) {
    const ringOptions = fields.emissionRing;

    let x = +ringOptions.querySelector(".x").value;
    let y = +ringOptions.querySelector(".y").value;
    let r = +ringOptions.querySelector(".r").value;
    let minR = +ringOptions.querySelector(".minR").value;

    x = x + this.width / 2 + xPos;
    y = y + this.height / 2 + yPos;

    this.maxR = new PIXI.Graphics();
    this.maxR.beginFill(0xff3300, 0.5);
    this.maxR.drawCircle(x, y, r);
    this.maxR.endFill();
    this.maxR.visible = fields.emitterArea.checked;
    this.stage.addChild(this.maxR);

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x000000, 0.5);
    this.graphics.drawCircle(x, y, minR);
    this.graphics.endFill();
    this.graphics.visible = fields.emitterArea.checked;

    this.stage.addChild(this.graphics);
  }

  destroy() {
    this.maxR?.destroy();
    this.graphics?.destroy();
  }

  eventsHandler() {
    fields.emitterArea.addEventListener("change", (e) => {
      const visible = e.target.checked;
      if (this.maxR) {
        this.maxR.visible = visible;
      }
      if (this.graphics) {
        this.graphics.visible = visible;
      }
    });
  }
}

export default EmitterArea;
