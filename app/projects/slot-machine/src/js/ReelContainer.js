import Reel from "./Reel.js";
import Symbols from "./Symbols.js";

class ReelContainer {
  constructor() {
    this.numOfTextures = 12;
    this.reelContainer = new PIXI.Container();

    this.buildTheReels();
    return this.reelContainer;
  }

  buildTheReels() {
    this.createSlotTextures();
    this.createContainer();
  }

  createSlotTextures() {
    this.slotTextures = [];
    for (let i = 0; i < this.numOfTextures; i++) {
      const name = i < 10 ? `M0${i}_000` : `M${i}_000`;
      this.slotTextures.push(PIXI.Texture.from(name));
    }
  }

  createContainer() {
    this.reelContainer.reels = [];
    for (let i = 0; i < 5; i++) {
      this.reel = new Reel(i);
      this.reelContainer.addChild(this.reel.container);
      new Symbols(this.reel, this.slotTextures);
      this.reelContainer.reels.push(this.reel);
    }
  }
}

export default ReelContainer;
