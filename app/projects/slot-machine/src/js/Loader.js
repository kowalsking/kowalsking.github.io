class Loader {
  constructor(onAssetsLoaded) {
    this.loader = new PIXI.Loader();
    this.loadAssets();
    this.loader.load(onAssetsLoaded);
    return this.loader;
  }

  loadAssets() {
    const numOfRes = 12;
    for (let i = 0; i <= numOfRes; i++) {
      const name = i < 10 ? `M0${i}_000` : `M${i}_000`;
      const path = `src/assets/${name}.jpg`;
      this.loader.add(name, path);
    }
  }
}

export default Loader;
