import { bigwinList } from "./config.js";
import fields from "./fields.js";
import Titles from "./titles.js";

class Sidebar {
  constructor() {
    this.createBigwinList();
    this.eventsHandler();

    new Titles();
  }

  createBigwinList() {
    Object.keys(bigwinList).map((bw) => {
      const option = document.createElement("option");
      option.textContent = `${bigwinList[bw].code} ${bigwinList[bw].name}`;
      option.value = `${bw}`;
      return fields.bigwinName.append(option);
    });
  }

  eventsHandler() {
    document.addEventListener("mouseover", (e) => {
      fields.openSidebar.style.opacity = 1;
    });

    document.addEventListener("mouseout", (e) => {
      fields.openSidebar.style.opacity = 0;
    });

    document.addEventListener("click", (e) => {
      if (e.target === fields.openSidebar) {
        this.openNav();
      } else if (e.target === fields.closeSidebar) {
        this.closeNav();
      }
    });

    fields.collapseButton.addEventListener("click", (e) => {
      document.querySelectorAll("details").forEach((detail) => {
        detail.removeAttribute("open");
      });
    });

    fields.expandButton.addEventListener("click", (e) => {
      document.querySelectorAll("details").forEach((detail) => {
        detail.setAttribute("open", "open");
      });
    });

    // fields.bigwinDuration.addEventListener("wheel", (e) => {
    //   e.preventDefault();
    //   const delta = -e.deltaY;
    //   fields.bigwinDuration.value = +fields.bigwinDuration.value + delta;
    // });

    fields.particleControls.addEventListener("click", (e) => {
      if (e.target.classList.contains("addParameter")) {
        const parameter = e.target.classList[1];
        this.showAddPopup(parameter);
      }
      if (e.target.classList.contains("ok")) {
        const parameter = e.target.classList[1];
        this.handleData(parameter);
      }
      if (e.target.classList.contains("cancel")) {
        const parameter = e.target.classList[1];
        fields[`${parameter}Popup`].style.display = "none";
      }
      if (e.target.classList.contains("deleteParameter")) {
        this.removeNode(e.target.parentNode.parentNode);
      }
      if (e.target.classList.contains("cogwheel")) {
        e.preventDefault();
        const parent = e.target.closest("details");
        this.cogwheelHandler(parent);
      }
      if (e.target.classList.contains("particleForever")) {
        fields.emitterLifetime.value = fields.particleForever.checked
          ? -1
          : 0.5;
      }
    });

    fields.particleControls.addEventListener("input", (e) => {
      const sliderComplex = e.target.closest(".sliderComplex");
      if (sliderComplex) {
        this.handleSliderComplex(sliderComplex);
      }
    });

    fields.spawnType.addEventListener("change", (e) => {
      this.handleSpawnType();
    });

    this.handlerActuationEmitter();
  }

  handleData(parameter) {
    this.clearWarning();
    const options = Sidebar.defineOptions(parameter);
    if (!this.validOptions(options)) return;
    const tr = Sidebar.createTableRow(options);
    Sidebar.sortWithNewElement(tr, options);
    this.hidePopup(parameter);
  }

  static defineOptions(parameter) {
    const time = fields[`${parameter}Popup`].querySelector(".time").value;
    const valueInput = fields[`${parameter}Popup`].querySelector(".value");
    const tbody = fields[`${parameter}Table`].querySelector("tbody");
    const children = Array.from(tbody.querySelectorAll("tr"));
    let minInput = fields[`${parameter}Popup`].querySelector(".minValue");
    let maxInput = fields[`${parameter}Popup`].querySelector(".maxValue");
    let value = valueInput ? valueInput.value : null;
    let min = minInput ? minInput.value : null;
    let max = maxInput ? maxInput.value : null;
    let type = "number";
    let step = 0.01;
    const button = true;
    const disable = minInput?.classList.contains("disable");

    if (parameter === "color") {
      value = fields.colorValue.value;
      type = "color";
    }

    return {
      parameter,
      time,
      value,
      tbody,
      children,
      max,
      min,
      step,
      type,
      disable,
      button,
    };
  }

  static input(value, options) {
    const step = value === "time" ? 0.01 : options.step;
    const max = value === "time" ? 1 : options.max;
    const type = value === "time" ? "number" : options.type;
    const className = options.parameter === "alpha" ? "alphaTime" : "";
    return `<input
        type="${type}"
        step="${step}"
        min="${options.min}"
        max="${max}"
        value="${options[value]}"
        class="${className}"
      />`;
  }

  static createTableRow(options) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <tr class="">
      <td class="timeInput">
        ${Sidebar.input("time", options)}
      </td>
      <td>
        ${
          options.parameter === "color"
            ? Sidebar.input("value", options)
            : Sidebar.sliderComplex(options)
        }
      </td>
      <td>
        ${
          options.parameter === "alpha"
            ? `+/-<input type="number" min="0" class="randomizer" value='0'>`
            : ""
        }
        ${options.button ? Sidebar.deleteButton() : ""}
      </td>
    </tr>
    `;
    return tr;
  }

  static sliderComplex(options) {
    return `
    <div class="sliderComplex listValue">
    <div class="sliderMinMax">
      <input class="min ${
        options.disable ? "disable" : ""
      }" type="number" value="${options.min}" />
      <input
        class="slider"
        type="range"
        min="${options.min}"
        max="${options.max}"
        step="${options.step}"
        value="${options.value}"
      />
      <input class="max ${
        options.disable ? "disable" : ""
      }" type="number" value="${options.max}" />
      <div class="vl"></div>
      <input
        type="number"
        class="sliderValue"
        value="${options.value}"
      />
    </div>
  </div>
    `;
  }

  static sortWithNewElement(tr, options) {
    const firstTr = options.tbody.querySelector("tr");
    const tds = options.tbody.querySelectorAll(".timeInput");
    const trs = [];
    tds.forEach((td) => {
      trs.push(td.parentNode);
    });
    trs.push(tr);
    trs
      .sort((first, second) => {
        const a = +first.querySelector("td > input").value;
        const b = +second.querySelector("td > input").value;
        return b - a;
      })
      .forEach((tr) => {
        options.tbody.insertBefore(tr, firstTr.nextSibling);
      });
  }

  handleSpawnType() {
    const emissions = [
      fields.emissionBurst,
      fields.emissionCircle,
      fields.emissionRectangle,
      fields.emissionRing,
    ];
    emissions.forEach((i) => {
      i.style.display = "none";
    });

    const target = fields.spawnType.value;

    switch (target) {
      case "rect":
        fields.emissionRectangle.style.display = "block";
        break;
      case "circle":
        fields.emissionCircle.style.display = "block";
        break;
      case "ring":
        fields.emissionRing.style.display = "block";
        break;
      case "burst":
        fields.emissionBurst.style.display = "block";
        break;
    }
  }

  handleSliderComplex(sliderComplex) {
    const sliderValue = sliderComplex.querySelector(".sliderValue");
    const slider = sliderComplex.querySelector(".slider");
    const min = sliderComplex.querySelector(".min");
    const max = sliderComplex.querySelector(".max");

    sliderValue.addEventListener("input", () => {
      if (+sliderValue.value > +max.value) {
        max.value = +sliderValue.value;
        slider.max = +sliderValue.value;
      }
      slider.value = sliderValue.value;
    });

    min.addEventListener("input", () => {
      slider.min = min.value;
      slider.step = this.calculateSliderStep(+min.value, +max.value);
    });

    max.addEventListener("input", () => {
      slider.max = max.value;
      slider.step = this.calculateSliderStep(+min.value, +max.value);
    });

    slider.addEventListener("input", () => {
      sliderValue.value = slider.value;
    });
  }

  calculateSliderStep(min, max) {
    const steps = max - min > 20 ? 50 : 20;
    return (max - min) / steps;
  }

  handlerActuationEmitter() {
    const variants = [
      fields.onSpineEvent,
      fields.onTimeInterval,
      fields.onEndBigwin,
      fields.particleForever,
      fields.particleOnClick,
    ];

    fields.actuationEmitter.addEventListener("change", (e) => {
      if (fields.actuationEmitter.checked) {
        variants.forEach((v) => {
          v.checked = true;
        });
      } else if (!fields.actuationEmitter.checked) {
        variants.forEach((v) => {
          v.checked = false;
        });
      }
    });

    variants.forEach((v) => {
      v.addEventListener("change", () => {
        fields.actuationEmitter.checked = false;
        if (v.className === "onTimeInterval") {
          if (v.checked) {
            fields.onTimeIntervalValue.focus();
          }
        }
      });
    });
  }

  cogwheelHandler(parent) {
    const min = parent.querySelectorAll(".min");
    const max = parent.querySelectorAll(".max");

    min.forEach((m) => {
      m.classList.toggle("disable");
    });

    max.forEach((m) => {
      m.classList.toggle("disable");
    });
  }

  showAddPopup(parameter) {
    return (fields[`${parameter}Popup`].style.display = "block");
  }

  openNav() {
    fields.sidebar.style.width = "500px";
    main.style.marginRight = "500px";
  }

  closeNav() {
    fields.sidebar.style.width = "0";
    main.style.marginRight = "0";
  }

  static deleteButton() {
    return `<button class="deleteParameter">-</button>`;
  }

  validOptions(options) {
    if (!options.time || !options.value) {
      fields.invalidJson.textContent = "All parameters are mandatory";
      return false;
    }
    return true;
  }

  hidePopup(parameter) {
    fields[`${parameter}Popup`].style.display = "none";
  }

  clearWarning() {
    fields.invalidJson.textContent = "";
  }

  removeNode(node) {
    return node.remove();
  }
}

export default Sidebar;
