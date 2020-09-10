import fields from "./fields.js";

class Emitter {
  constructor(container, art, config) {
    this.container = container;
    this.art = art;
    this.config = config;
    this.intermediateValue = 0;
    this.createEmitter();
  }

  createEmitter() {
    this.particles = new PIXI.particles.Emitter(
      this.container,
      this.art,
      this.config
    );
    this.particles.particleConstructor = PIXI.particles.AnimatedPathParticle;
  }

  changeEmitterPosition(width, height) {
    if (fields.spawnType.value === "rect") {
      this.particles.updateOwnerPos(
        width / 2 - this.particles.spawnRect.width / 2,
        height / 2 - this.particles.spawnRect.height / 2
      );
    } else {
      this.particles.updateOwnerPos(width / 2, height / 2);
    }
  }

  update(frequency, delta) {
    this.particles.update(frequency);

    const onTimeInterval = fields.onTimeInterval.checked;
    const onTimeIntervalValue = +fields.onTimeIntervalValue.value;

    if (onTimeInterval) {
      this.intermediateValue += delta;
      if (this.intermediateValue >= onTimeIntervalValue) {
        this.particles.emit = true;
        this.intermediateValue = 0;
      }
    }
  }
}

export default Emitter;
