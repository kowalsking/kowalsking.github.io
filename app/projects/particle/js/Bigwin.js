import { bigwinList } from "./config.js";
import fields from "./fields.js";

class Bigwin {
  constructor(res, container) {
    this.res = res;
    this.container = container;
    this.animationSetup();
    this.createBigwin();
  }

  animationSetup() {
    this.name = fields.bigwinName.value;
    this.type = fields.bigwinType.value;
    this.duration = +fields.bigwinDuration.value;
  }

  update(frequency) {
    this.bigwin.update(frequency);
  }

  createBigwin() {
    const data = this.res[this.name].spineData;
    this.bigwin = new PIXI.spine.Spine(data);
    this.bigwin.skeleton.setToSetupPose();
    this.bigwin.autoUpdate = false;
  }

  setAnimation() {
    const animation = bigwinList[this.name].animation;
    this.bigwin.state.setAnimation(0, animation, true);
  }

  killAnination() {
    this.finalPath = true;
    this.loops = 1;
    const endPathStarted = bigwinList[this.name].loopEndFrame / 30;
    this.bigwin.state.tracks[0].trackTime = endPathStarted;
  }

  handleBigwinEvents(emitter) {
    this.bigwin.state.onComplete = () => {
      this.finalPath = false;
    };

    this.bigwin.state.onEvent = (i, event) => {
      const start = bigwinList[this.name].startLoop === event.data.name;
      const end = bigwinList[this.name].endLoop === event.data.name;
      const onSpineEvent = fields.onSpineEvent.checked;
      const onEndBigwin = fields.onEndBigwin.checked;
      const emitEvent = bigwinList[this.name].emitEvent === event.data.name;

      if (start) {
        this.startLoop();
      }

      if (end) {
        this.finalPath = true;
        this.endLoop();
        if (onEndBigwin) {
          emitter.emit = true;
        }
      }

      if (emitEvent && onSpineEvent) {
        emitter.emit = true;
      }
    };
  }

  startLoop() {
    return (this.bigwin.state.timeScale = this.speed);
  }

  endLoop() {
    if (this.type === "stretch") {
      this.bigwin.state.timeScale = 1;
    } else if (this.type === "loop") {
      if (--this.loops === 0) {
        this.calculateSpeed();
        this.bigwin.state.timeScale = 1;
        return;
      } else {
        const jumpTrackTime =
          (bigwinList[this.name].loopStartFrame * 30) / 1000; //start loop time
        this.bigwin.state.tracks[0].trackTime = jumpTrackTime;
      }
    }
  }

  calculateSpeed() {
    const duration = this.duration;
    const loopStartFrame = bigwinList[this.name].loopStartFrame;
    const loopEndFrame = bigwinList[this.name].loopEndFrame;
    this.animationStart = (loopStartFrame / 30) * 1000;
    this.animationEnd = (loopEndFrame / 30) * 1000;
    const framesCount = loopEndFrame - loopStartFrame;
    const loopDurationInMs = framesCount * 30;

    if (this.type === "stretch") {
      return (this.speed = Math.abs(
        (this.animationEnd - this.animationStart) /
          (duration - this.animationStart)
      ));
    } else if (this.type === "loop") {
      this.loops = Math.round(duration / loopDurationInMs);
      if (this.loops === 0) this.loops = 1;
      return (this.speed = duration / (loopDurationInMs * this.loops));
    }
  }
}

export default Bigwin;
