class Symbols {
  constructor(reel, slotTextures) {
    this.reel = reel;
    this.slotTextures = slotTextures;
    this.size = 150;
    this.numOfSymbols = 4;
    this.init();
  }

  init() {
    for (let j = 0; j < this.numOfSymbols; j++) {
      this.createSymbol();
      this.scaleSymbol(j);
      this.reel.symbols.push(this.symbol);
      this.reel.container.addChild(this.symbol);
    }
  }

  createSymbol() {
    this.symbol = new PIXI.Sprite(
      this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)]
    );
  }

  scaleSymbol(j) {
    // scale the symbol to fit symbol area
    this.symbol.y = j * this.size;
    this.symbol.scale.x = this.symbol.scale.y = Math.min(
      this.size / this.symbol.width,
      this.size / this.symbol.height
    );
    this.symbol.x = Math.round((this.size - this.symbol.width) / 2);
  }
}

export default Symbols;
