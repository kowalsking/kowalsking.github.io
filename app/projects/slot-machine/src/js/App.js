import ReelContainer from "./ReelContainer.js";
import Loader from "./Loader.js";

class App {
  constructor() {
    this.updateTime = 0;
    this.stage = new PIXI.Container();

    this.createApplication();

    this.loader = new Loader(this.init.bind(this));
  }

  createApplication() {
    this.app = new PIXI.Application({
      height: 450,
      backgroundColor: 0x00ffff,
    });
    const view = document.querySelector(".view");
    view.append(this.app.view);
  }

  init() {
    this.createReels();
    this.createButton();

    requestAnimationFrame((time) => this.update(time));
  }

  update(time) {
    this.startPlay();
    this.updateTime = time;

    requestAnimationFrame((time) => this.update(time));
  }

  createReels() {
    this.ReelContainer = new ReelContainer();
    this.reels = this.ReelContainer.reels;

    this.app.stage.addChild(this.ReelContainer);
  }

  createButton() {
    const button = document.querySelector("#spinButton");
    button.addEventListener("click", () => {
      this.reels.forEach((r) => {
        r.running = true;
      });
      this.handleEnd();
    });
  }

  startPlay() {
    this.reels.forEach((r, idx) => {
      if (r.running === true) {
        r.symbols.forEach((s) => {
          s.y += 10 + idx * 5; // acceleration
          this.handleEdgeOfScreen(r.symbols);
        });
      }
    });
  }

  handleEdgeOfScreen(entities) {
    entities.forEach((entity) => {
      if (entity.y > this.app.view.height) {
        entity.y = -entity.height;
      }
    });
  }

  handleEnd() {
    this.reels.forEach((r, idx) => {
      setTimeout(() => {
        r.running = false;
      }, ++idx * 1000);
    });
  }

  reelsComplete() {
    this.running = false;
  }
}

export default App;
