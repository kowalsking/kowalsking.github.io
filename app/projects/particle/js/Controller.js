import { bigwinList } from "./config.js";
import fields from "./fields.js";
import ParticleConfig from "./ParticleConfig.js";
import Events from "./Events.js";
import EmitterArea from "./EmitterArea.js";
import Emitter from "./Emitter.js";
import Bigwin from "./Bigwin.js";
import ActualControls from "./ActualControls.js";
import Sidebar from "./Sidebar.js";
import canvasControls from "./tools/canvasControls.js";

class Controller {
  constructor() {
    this.sidebar = new Sidebar();

    this.width = 1920;
    this.height = 1080;
    this.backgroundImage = "DL_0";
    this.imagePaths = JSON.parse(fields.imageTextarea.value);
    this.isSideBarOpen = false;
    this.setup();
  }

  configSetup() {
    this.config = this.useAdvancedConfig
      ? JSON.parse(fields.emitterTextarea.value)
      : new ParticleConfig();
    console.log(this.config);
    this.imagePaths = JSON.parse(fields.imageTextarea.value);
  }

  setup() {
    this.elapsed = Date.now();
    this.setupCanvas();
    this.cvControls = new canvasControls();
    new Events(this);
    this.preload();
  }

  setupCanvas() {
    this.createCanvas();
    this.createRenderer();
    this.resizeCanvas();
  }

  createCanvas() {
    this.canvas = document.querySelector("#canvas");
    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
    });
    this.canvas.append(this.app.view);
    this.app.width = this.width;
    this.app.height = this.height;
  }

  createRenderer() {
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(this.app.width, this.app.height, {
      view: this.app.view,
    });
  }

  preload() {
    this.loader = PIXI.loader;
    this.loadInitialFiles();

    this.loader.load((_, res) => {
      this.onAssetsLoaded(_, res);
      this.update();
      fields.loader.style.display = "none";
      fields.openSidebar.style.display = "block";
    });
  }

  loadInitialFiles() {
    const urls = [this.imagePaths.spritesheet];

    Object.keys(bigwinList).forEach((bw) => {
      this.loader.add(`${bw}`, bigwinList[bw].path);
    });
    this.loader.add(`coin`, urls[0]);
    this.loader.add(`focus.png`, "images/focus.png");
  }

  onAssetsLoaded() {
    this.stage.removeChildren();
    this.endTime = null;
    this.changeBackground(this.background);
    this.setupParticle();
    this.bigwin.handleBigwinEvents(this.emitter.particles);
  }

  updateAssets() {
    this.emitter.particles.destroy();
    this.focus.destroy();
    this.endTime = null;
    this.setupParticle();
  }

  setupSpine(_, res) {
    this.renderer.backgroundColor = 0x000000;
    this.bigwin = new Bigwin(res, this.bigwinContainer);
    this.setupBigwinContainer();
    this.bigwin.setAnimation();
    this.bigwin.calculateSpeed();
  }

  setupBigwinContainer() {
    if (this.bigwinContainer) {
      this.bigwinContainer.removeChildren();
    } else {
      this.bigwinContainer = new PIXI.Container();
    }
    this.bigwinContainer.addChild(this.bigwin.bigwin);
    this.bigwinContainer.scale.set(1);
    this.bigwinContainer.position.set(this.width / 2, this.height / 2);
    this.stage.addChild(this.bigwinContainer);
  }

  setupParticle() {
    this.configSetup();
    this.addFocusPosition();
    this.changeLinkToDownload();
    this.createEmitterArea();
    const useNewEmitter = fields.useNewEmitter.checked;
    const art = this.imagePaths.art;
    if (useNewEmitter) {
      this.emitterContainer = new PIXI.Container();
    } else {
      return this.stage.addChild(this.emitterContainer);
    }
    this.stage.addChild(this.emitterContainer);
    this.emitter = new Emitter(this.emitterContainer, art, this.config);
    this.emitter.changeEmitterPosition(this.width, this.height);
  }

  addFocusPosition() {
    const path = "images/focus.png";
    const texture = PIXI.Texture.fromImage(path);
    this.focus = new PIXI.Sprite(texture);
    // this.focus.anchor.set(0.5);
    this.focus.interactive = true;
    this.focus.buttonMode = true;
    this.focusEvents();
    this.changeFocusPosition();
    this.stage.addChild(this.focus);
  }

  changeFocusPosition() {
    this.focus.x = this.config.pos.x + this.width / 2 - this.focus.width / 2;
    this.focus.y = this.config.pos.y + this.height / 2 - this.focus.height / 2;
  }
  focusEvents() {
    const onDragStart = (event) => {
      this.focus.data = event.data;
      this.focus.alpha = 0.5;
      this.focus.dragging = true;
    };

    const onDragEnd = () => {
      this.focus.alpha = 1;
      this.focus.dragging = false;
      this.focus.data = null;
    };

    const onDragMove = (e) => {
      if (this.focus.dragging) {
        const newPosition = this.focus.data.getLocalPosition(this.focus.parent);
        this.focus.x = newPosition.x;
        this.focus.y = newPosition.y;
        const x = e.data.global.x;
        const y = e.data.global.y;
        this.emitter.particles.updateOwnerPos(x, y);
        fields.positionX.value =
          this.focus.x - this.width / 2 + this.focus.width / 2;
        fields.positionY.value =
          this.focus.y - this.height / 2 + this.focus.height / 2;
      }
    };

    this.focus
      .on("pointerdown", onDragStart)
      .on("pointerup", onDragEnd)
      .on("pointerupoutside", onDragEnd)
      .on("pointermove", onDragMove);
  }

  update() {
    window.requestAnimationFrame.bind(window, this.update.bind(this))();

    const now = Date.now();
    const delta = now - this.elapsed;
    const frequency = delta * 0.001;
    const fps = 1000 / delta;

    this.bigwin.update(frequency);
    this.emitter.update(frequency, delta);

    framerate.innerHTML = `FPS: ${fps.toFixed(2)}`;
    this.elapsed = now;
    this.renderer.render(this.stage);
  }

  resizeCanvas() {
    const sideBarWidth = 500;
    const ratio = 1920 / 1080;
    let freeAreaWidth = window.innerWidth;
    let freeAreaHeight = window.innerHeight;
    if (this.isSideBarOpen) {
      freeAreaWidth -= sideBarWidth;
    }

    let canvasWidth = freeAreaWidth;
    let canvasHeight = freeAreaHeight;

    if (canvasWidth / canvasHeight >= ratio) {
      canvasWidth = canvasHeight * ratio;
    } else {
      canvasHeight = canvasWidth / ratio;
    }

    this.app.renderer.view.style.width = canvasWidth + "px";
    this.app.renderer.view.style.height = canvasHeight + "px";
  }

  debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
      const context = this;
      const args = arguments;

      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  changeBackground(type = "bigwin") {
    this.stage.removeChildren();
    const bcgTypes = [
      fields.bigwinSetup,
      fields.colorSetup,
      fields.imageSetup,
      fields.customImageSetup,
    ];

    bcgTypes.forEach((t) => {
      t.classList.contains(type)
        ? t.classList.remove("disable")
        : t.classList.add("disable");
    });

    switch (type) {
      case "bigwin":
        this.setupSpine(null, this.loader.resources);
        break;
      case "color":
        this.stage.removeChild(this.bigwinContainer);
        const color = fields.colorSetup.querySelector("input").value.slice(1);
        this.renderer.backgroundColor = `0x${color}`;
        break;
      case "image":
        this.backgroundImage = fields.selectImageSetup.value;
        this.changeBackgroundImage();
        break;
      case "customImage":
        this.changeBackgroundImage();
        return;
    }
  }

  changeBackgroundImage() {
    this.stage.removeChildren();
    const data = this.backgroundImage.includes("data:");
    const path = data
      ? this.backgroundImage
      : `images/background/${this.backgroundImage}.jpg`;
    const texture = PIXI.Texture.fromImage(path);
    const bg = new PIXI.Sprite(texture);
    bg.width = this.app.view.width;
    bg.height = this.app.view.height;
    bg.tint = 0xffffff;
    this.stage.addChild(bg);
  }

  handleLoadData(resourses) {
    const keys = Object.keys(resourses);
    const flag = keys.some((key) => resourses[key].extension === "json");
    if (flag) {
      const json = keys.find((key) => resourses[key].extension === "json");
      const textures = Object.keys(resourses[json].textures);
      this.fillImageTextarea(textures);
    } else {
      this.changeImageConfig(resourses);
    }
  }

  changeImageConfig(resourses) {
    const textures = [];
    const images = Object.keys(resourses);
    images.forEach((img) => {
      if (resourses[img].extension === "png") {
        textures.push(resourses[img].name);
      }
    });

    this.fillImageTextarea(textures);
  }

  fillImageTextarea(textures) {
    return (fields.imageTextarea.value = `
    {
      "spritesheet": "images/coin.json",
      "art": [
        {
          "framerate": 30,
          "loop": true,
          "textures": ${JSON.stringify(textures)}
        },
        {
          "framerate": 30,
          "loop": true,
          "textures": ${JSON.stringify(textures.reverse())}
        }
      ]
    }
    `);
  }

  createEmitterArea() {
    const target = fields.spawnType.value;
    if (this.emitterArea) {
      this.emitterArea.destroy();
    }
    this.emitterArea = new EmitterArea(
      target,
      this.stage,
      this.width,
      this.height,
      this.config
    );
  }

  changeLinkToDownload() {
    const prettyConfig = JSON.stringify(this.config, null, 4);
    fields.emitterTextarea.value = prettyConfig;
    const blob = new Blob([prettyConfig], { type: "application/json" });
    fields.downloadConfig.href = URL.createObjectURL(blob);
  }

  handleTextarea(textarea) {
    try {
      const obj = JSON.parse(textarea.value);
      textarea.classList.remove("error");
      textarea.value = JSON.stringify(obj, undefined, 4);
      fields.invalidJson.textContent = "";
    } catch (e) {
      fields.invalidJson.textContent = e.message;
      console.log(e);
      textarea.classList.add("error");
    }
  }

  makeActualTypeOfControls() {
    this.handleTextarea(fields.emitterTextarea);
    const config = JSON.parse(fields.emitterTextarea.value);
    new ActualControls(config);
    this.cvControls = new canvasControls();

    console.log(config);
  }

  freshUp() {
    this.useAdvancedConfig = false;
    this.background = fields.bcgSetup.value;
    this.handleTextarea(fields.imageTextarea);
    this.handleTextarea(fields.emitterTextarea);
    this.updateAssets();
    if (fields.emitterArea.checked) {
      this.createEmitterArea();
    }
    this.changeLinkToDownload();
  }
}

export default Controller;
