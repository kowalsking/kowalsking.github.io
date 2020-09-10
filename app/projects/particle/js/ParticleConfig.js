import fields from "./fields.js";

class ParticleConfig {
  constructor() {
    this.mandatoryFields();
    this.spawnTypeValue();

    return this.parameters;
  }

  mandatoryFields() {
    this.parameters = {
      alpha: {
        list: this.listOfValues("alpha"),
      },
      scale: {
        list: this.listOfValues("scale"),
        minimumScaleMultiplier: 1 / +fields.minimumScaleMultiplier.value,
      },
      speed: {
        list: this.listOfValues("speed"),
        minimumSpeedMultiplier: 1 / +fields.minimumSpeedMultiplier.value,
      },
      color: {
        list: this.listOfValues("color"),
      },
      rotationSpeed: {
        list: this.listOfValues("rotationSpeed"),
      },
      startRotation: {
        // min: +fields.startRotationMin.value,
        // max: +fields.startRotationMax.value,
        min: +fields.angleWidth.dataset.from,
        max: +fields.angleWidth.dataset.to,
      },
      lifetime: {
        min: +fields.lifetimeMin.value,
        max: +fields.lifetimeMax.value,
      },
      pos: {
        x: +fields.positionX.value,
        y: +fields.positionY.value,
      },
      acceleration: {
        x: { list: this.listOfValues("accelerationX") },
        y: { list: this.listOfValues("accelerationY") },
      },
      noRotation: fields.noRotation.checked,
      rotationAcceleration: +fields.rotationAcceleration.value,
      blendMode: fields.blendMode.value,
      addAtBack: fields.addAtBack.checked,
      orderedArt: fields.orderedArt.checked,
      autoUpdate: fields.autoUpdate.checked,
      frequency: 1 / +fields.frequency.value,
      emitterLifetime: +fields.emitterLifetime.value,
      maxParticles: +fields.maxParticles.value,
      spawnType: fields.spawnType.value,
      extraData: this.extraData(),
      dimas: 1,
    };
  }

  extraData() {
    return fields.extraData.value.length
      ? JSON.parse(fields.extraData.value)
      : "";
  }

  listOfValues(key) {
    const tbody = fields[`${key}Table`].querySelector("tbody");
    const trs = tbody.querySelectorAll("tr");
    const children = Array.from(trs);

    return children.map((tr) => {
      const randomizer = +tr.querySelector(".randomizer")?.value;
      const tds = tr.querySelectorAll("td");
      let time =
        tds[0].childElementCount === 0
          ? tds[0].textContent
          : tds[0].querySelector("input").value;
      const valueValue =
        key === "color"
          ? tds[1].querySelector("input").value
          : tds[1].querySelector(".sliderValue").value;
      return {
        time: +time,
        value: isNaN(valueValue) ? valueValue : +valueValue,
        randomizer: randomizer,
      };
    });
  }

  spawnTypeValue() {
    const target = fields.spawnType.value;

    switch (target) {
      case "rect":
        return (this.parameters.spawnRect = {
          x: +fields.emissionRectangle.querySelector(".x").value,
          y: +fields.emissionRectangle.querySelector(".y").value,
          w: +fields.emissionRectangle.querySelector(".w").value,
          h: +fields.emissionRectangle.querySelector(".h").value,
        });
      case "circle":
        return (this.parameters.spawnCircle = {
          x: +fields.emissionCircle.querySelector(".x").value,
          y: +fields.emissionCircle.querySelector(".y").value,
          r: +fields.emissionCircle.querySelector(".r").value,
        });
      case "ring":
        return (this.parameters.spawnCircle = {
          x: +fields.emissionRing.querySelector(".x").value,
          y: +fields.emissionRing.querySelector(".y").value,
          r: +fields.emissionRing.querySelector(".r").value,
          minR: +fields.emissionRing.querySelector(".minR").value,
        });
      case "burst":
        this.parameters.particlesPerWave = +fields.emissionBurst.querySelector(
          ".perWave"
        ).value;
        this.parameters.particleSpacing = +fields.emissionBurst.querySelector(
          ".spacing"
        ).value;
        this.parameters.angleStart = +fields.emissionBurst.querySelector(
          ".startAngle"
        ).value;
        break;
    }
  }
}

export default ParticleConfig;
