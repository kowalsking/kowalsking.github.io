import fields from "./fields.js";
import Sidebar from "./Sidebar.js";

class ActualControls {
  constructor(config) {
    this.config = config;
    this.fillFields();
  }

  fillFields() {
    const c = this.config;
    try {
      this.listOfValues("alpha");
      this.listOfValues("scale");
      this.listOfValues("speed");
      this.listOfValues("color");
      fields.minimumScaleMultiplier.value = c.scale.minimumScaleMultiplier;
      fields.minimumScaleMultiplierValue.value = c.scale.minimumScaleMultiplier;

      fields.minimumSpeedMultiplier.value = c.speed.minimumSpeedMultiplier;
      fields.minimumSpeedMultiplierValue.value = c.speed.minimumSpeedMultiplier;
      this.listOfValues("rotationSpeed");
      fields.angleWidth.dataset.from = c.startRotation.min;
      fields.angleWidth.dataset.to = c.startRotation.max;
      fields.lifetimeMin.value = c.lifetime.min;
      fields.lifetimeMax.value = c.lifetime.max;
      fields.positionX.value = c.pos.x;
      fields.positionY.value = c.pos.y;
      this.config.accelerationX = c.acceleration.x;
      this.config.accelerationY = c.acceleration.y;
      this.listOfValues("accelerationX");
      this.listOfValues("accelerationY");
      fields.noRotation.checked = c.noRotation;
      fields.rotationAcceleration.value = c.rotationAcceleration;
      fields.blendMode.value = c.blendMode;
      fields.addAtBack.checked = c.addAtBack;
      fields.orderedArt.checked = c.orderedArt;
      fields.autoUpdate.checked = c.autoUpdate;
      fields.frequency.value = c.frequency;
      fields.emitterLifetime.value = c.emitterLifetime;
      fields.maxParticles.value = c.maxParticles;
      fields.spawnType.value = c.spawnType;
      fields.extraData.value = c.extraData;
    } catch (e) {
      console.log(e);
    }
  }

  listOfValues(key) {
    const options = Sidebar.defineOptions(key);
    const tbody = fields[`${key}Table`].querySelector("tbody");
    tbody.innerHTML = "";
    const values = this.config[key].list;
    const children = [];

    values.forEach((value, idx) => {
      options.time = value.time;
      options.value = value.value;
      options.button = idx === 0 || idx === values.length - 1 ? false : true;
      const tr = Sidebar.createTableRow(options);
      children.push(tr);
    });

    children
      .sort((first, second) => {
        const a = +first.querySelector("td > input").value;
        const b = +second.querySelector("td > input").value;
        return a - b;
      })
      .forEach((tr) => {
        return tbody.append(tr);
      });
  }
}

export default ActualControls;
