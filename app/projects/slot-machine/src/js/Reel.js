class Reel {
  constructor(idx) {
    this.idx = idx;
    this.width = 160;
    this.createContainer();
    return this.reel();
  }

  createContainer() {
    this.container = new PIXI.Container();
    this.container.x = this.idx * this.width;
  }

  reel() {
    return {
      container: this.container,
      symbols: [],
      running: false,
    };
  }
}

export default Reel;
