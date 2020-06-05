import fields from "./fields.js";

class ParticleConfig {
  constructor() {
    return this.mandatoryFields();
  }

  mandatoryFields() {
    return (this.parameters = {
      alpha: {
        list: this.listOfValues("alpha"),
      },
      scale: {
        list: this.listOfValues("scale"),
        minimumScaleMultiplier: +fields.minimumScaleMultiplier.value,
      },
      speed: {
        list: this.listOfValues("speed"),
        isStepped: fields.isStepped.hasAttribute("checked"),
        minimumSpeedMultiplier: +fields.minimumSpeedMultiplier.value,
      },
      сolor: {
        list: this.listOfValues("color"),
      },
      rotationSpeed: {
        min: +fields.rotationSpeedMin.value,
        max: +fields.rotationSpeedMax.value,
      },
      startRotation: {
        min: +fields.startRotationMin.value,
        max: +fields.startRotationMax.value,
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
        x: +fields.accelerationX.value,
        y: +fields.accelerationY.value,
      },
      frequency: +fields.frequency.value,
      emitterLifetime: +fields.emitterLifetime.value,
      maxParticles: +fields.maxParticles.value,
      spawnType: fields.spawnType.value,
      blendMode: "normal",
    });
  }

  listOfValues(key) {
    const tbody = fields[`${key}Table`].querySelector("tbody");
    const trs = tbody.querySelectorAll("tr");
    const children = Array.from(trs);

    return children.map((tr) => {
      const tds = tr.querySelectorAll("td");
      const timeValue =
        tds[0].childElementCount === 0
          ? tds[0].textContent
          : tds[0].querySelector("input").value;
      const valueValue = tds[1].querySelector("input").value;
      return {
        time: +timeValue,
        value: isNaN(valueValue) ? valueValue : +valueValue,
      };
    });
  }
}

export default ParticleConfig;
