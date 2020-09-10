import fields from "./fields.js";

class Titles {
  constructor() {
    this.createConfig();
    this.giveTitle();
  }

  createConfig() {
    this.config = {
      loadSomeFiles:
        "Download files for particles. Accepts .json + .png/.jpg/.jpeg or a set of pictures.",
      bcgSetup: "Select type of background",
      t_bigwin: "Bigwin to choose from the list",
      t_color: "Any color you like",
      t_image: "Background image from the list",
      t_customImage: "Upload your own picture",
      t_stretch: "Bigwin's mode, in which it stretches all the time",
      t_loop:
        "Bigwin's mode, in which he does cyclical repetitions throughout the duration",
      t_duration: "Duration of BigWin",
      addParameter: "Add new parameter to timeline",
      randomizer: "Adds some randomness in the range +/- this number",
      sliderValue: "The value is most likely used in the config",
      min: "Minimum slider value",
      max: "Maximum slider value",
      minimumSmultiplier: "Random spread between particles",
      t_angleWidth: "Particle scattering angle",
      t_lifetime: "Particle lifetime",
      t_rotationSpeed: "Particle rotation",
      t_rotationAcceleration: "Particle rotation acceleration",
      t_blendMode: "I don't know what it is and why",
      t_extraData:
        "Using this parameter, you can make the particles move along a non-standard path, for example, in a circle",
      t_noRotation: "Disable particle rotation",
      t_forever: "Trigger emitter forever",
      t_spineEvent: "If spine animation has an event for particles",
      t_onClick: "Trigger by click",
      t_onTimeInterval: "Trigger by interval",
      t_onEndBigwin: "When bigwin ends",
      t_spawnType: "Type of emitter",
      t_burst: "IDK",
      t_xRect: "The position X of the square relative to the emitter",
      t_yRect: "The position Y of the square relative to the emitter",
      t_xCircle: "The position Y of the circle relative to the emitter",
      t_YCircle: "The position Y of the circle relative to the emitter",
      t_minRadius: "Inner circle radius",
      t_maxRadius: "Outer circle radius",
      t_position: "Position of emitter",
      t_particlesPS: "Frequency of particles",
      t_emitterLifetime: "Emitter Lifetime",
      t_maxParticles: "Maximum particles per life period",
      t_advancedConfig: "Manual config setting",
      t_download: "Download config",
      t_upload: "Upload config",
      t_particleConfig: "Particle config",
      t_imageConfig: "Config for images/textures",
    };
  }

  giveTitle() {
    Object.keys(this.config).forEach((el) => {
      return document.querySelectorAll(`.${el}`).forEach((e) => {
        e.style.cursor = "help";
        e.setAttribute("title", this.config[el]);
      });
    });
  }
}

export default Titles;
