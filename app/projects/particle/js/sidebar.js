import { bigwinList } from "./config.js";
import fields from "./fields.js";

class Sidebar {
  constructor() {
    this.createBigwinList();
    this.eventsHandler();
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

    fields.bigwinDuration.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = -e.deltaY;
      fields.bigwinDuration.value = +fields.bigwinDuration.value + delta;
    });

    fields.particleControls.addEventListener("click", (e) => {
      if (e.target.classList.contains("addParameter")) {
        const parameter = e.target.classList[1];
        this.showAddPopup(parameter);
      }
      if (e.target.classList.contains("ok")) {
        const parameter = e.target.classList[1];
        this.handleData(parameter);
      }
      if (e.target.classList.contains("deleteParameter")) {
        this.removeNode(e.target.parentNode.parentNode);
      }
    });

    this.minimumScaleMultiplier();
    this.minimumSpeedMultiplier();
    this.isStepped();
  }

  handleData(parameter) {
    this.clearWarning();
    const options = this.defineOptions(parameter);
    if (!this.validOptions(options)) return;
    const tr = this.createTableRow(options);
    this.sortWithNewElement(tr, options);
    this.hidePopup(parameter);
    this.additionalOptions(options);
  }

  defineOptions(parameter) {
    const time = fields[`${parameter}Popup`].querySelectorAll("input")[0];
    const value = fields[`${parameter}Popup`].querySelectorAll("input")[1];
    const tbody = fields[`${parameter}Table`].querySelector("tbody");
    const children = Array.from(tbody.querySelectorAll("tr"));
    let type = "number";
    let min = 0;
    let max = 1;
    let step = 0.01;

    if (parameter === "speed") {
      max = null;
      step = 100;
    }

    if (parameter === "color") {
      max = null;
      min = null;
      step = null;
      type = "color";
    }

    return {
      name: parameter,
      time: time.value,
      value: value.value,
      tbody: tbody,
      children: children,
      max: max,
      min: min,
      step: step,
      type: type,
    };
  }

  additionalOptions(options) {
    const parameter = options.name;
    if (parameter === "scale") {
    }
  }

  input(value, options) {
    const step = value === "time" ? 0.01 : options.step;
    const max = value === "time" ? 1 : options.max;
    const type = value === "time" ? "number" : options.type;
    return `<input
        type="${type}"
        step="${step}"
        min="${options.min}"
        max="${max}"
        value="${options[value]}"
      />`;
  }

  createTableRow(options) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <tr class="">
      <td class="timeInput">
        ${this.input("time", options)}
      </td>
      <td>
        ${this.input("value", options)}
      </td>
      <td>${this.deleteButton()}</td>
    </tr>
    `;
    return tr;
  }

  sortWithNewElement(tr, options) {
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

  minimumScaleMultiplier() {
    const input = fields.minimumScaleMultiplier;
    const span = fields.minimumScaleMultiplier.parentElement.querySelector(
      "span"
    );

    input.addEventListener("input", () => {
      span.textContent = input.value;
    });
  }

  minimumSpeedMultiplier() {
    const input = fields.minimumSpeedMultiplier;
    const span = fields.minimumSpeedMultiplier.parentElement.querySelector(
      "span"
    );

    input.addEventListener("input", () => {
      span.textContent = input.value;
    });
  }

  isStepped() {
    fields.isStepped.addEventListener("click", () => {
      fields.isStepped.toggleAttribute("checked");
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

  deleteButton() {
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

new Sidebar();
