const loadFile = function (file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = (e) => {
      reject("Error: " + file.name);
    };
    fileReader.onload = (e) => {
      resolve(e.target.result);
    };
    fileReader.readAsDataURL(file);
  });
};

export default async function loadFiles(files) {
  const loader = new PIXI.loaders.Loader();
  for (let i = 0; i < files.length; i++) {
    const url = await loadFile(files[i]);
    const filename = files[i].name;
    const name = filename.split(".")[0];
    const extension = filename.split(".")[1];
    switch (extension) {
      case "json":
        loader._afterMiddleware = [];
        loader.add(filename, url);
        break;
      case "png":
      case "jpg":
      case "jpeg":
        loader.add(filename, url);
        break;
      default:
        throw "Unsupported type: " + extension;
    }
    await new Promise((resolve) => {
      loader.load((_, res) => {
        if (extension === "json") {
          const jsonData = res[filename].data;
          if (jsonData.frames.length) {
            const framesObj = {};
            for (let i = 0; i < jsonData.frames.length; i++) {
              const frameElem = jsonData.frames[i];
              framesObj[frameElem.filename] = frameElem;
              delete frameElem.filename;
            }
            jsonData.frames = framesObj;
          }

          const imageForAtlas = PIXI.utils.TextureCache[jsonData.meta.image];
          if (imageForAtlas) {
            const spritesheet = new PIXI.Spritesheet(
              imageForAtlas.baseTexture,
              jsonData,
              filename
            );
            spritesheet.parse(() => {
              res[filename].spritesheet = spritesheet;
              res[filename].textures = spritesheet.textures;
            });
          } else {
            throw "No image for json: " + jsonData.meta.image;
          }
        }

        resolve();
      });
    });
  }
  return loader.resources; //We can return some info here
}
