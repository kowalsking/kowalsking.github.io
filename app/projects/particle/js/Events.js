import fields from "./fields.js";
import loadFiles from "./tools/loadFiles.js";

class Events {
  constructor(controller) {
    this.ctrl = controller;
    this.eventsHandler();
  }

  eventsHandler() {
    this.canvasControllers();

    fields.position.addEventListener("input", (e) => {
      this.ctrl.configSetup();
      this.ctrl.changeFocusPosition();
    });

    fields.emitterFocus.addEventListener("change", (e) => {
      const visible = e.target.checked;
      this.ctrl.focus.visible = visible;
    });

    fields.loadConfig.addEventListener("change", (e) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        fields.emitterTextarea.value = e.target.result;
        this.ctrl.handleTextarea(fields.emitterTextarea);
      };

      fr.readAsText(e.target.files[0]);
    });

    fields.selectImageSetup.addEventListener("change", (e) => {
      this.ctrl.backgroundImage = e.target.value;
      this.ctrl.changeBackgroundImage();
    });

    fields.useAdvancedConfig.addEventListener("click", (e) => {
      this.ctrl.useAdvancedConfig = true;
      this.freshUp();
      this.ctrl.makeActualTypeOfControls();
    });

    fields.bcgSetup.addEventListener("change", (e) => {
      const type = e.target.value;
      this.ctrl.changeBackground(type);
      this.ctrl.addFocusPosition();
      if (fields.emitterArea.checked) {
        this.ctrl.createEmitterArea();
      }
    });

    fields.colorSetup.addEventListener("input", (e) => {
      this.ctrl.renderer.backgroundColor = `0x${e.target.value.slice(1)}`;
    });

    this.ctrl.app.renderer.plugins.interaction.on("pointerdown", (e) => {
      if (fields.particleOnClick.checked) {
        this.ctrl.emitter.particles.emit = true;
        this.ctrl.emitter.particles.resetPositionTracking();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!this.ctrl.bigwin.finalPath && e.keyCode === 32 && !this.space) {
        e.preventDefault();

        this.ctrl.bigwin.killAnination();
      }
    });

    fields.emitterTextarea.addEventListener("focus", (e) => {
      this.space = true;
    });

    fields.emitterTextarea.addEventListener("focusout", (e) => {
      this.space = false;
    });

    fields.closeSidebar.addEventListener("click", (e) => {
      this.ctrl.isSideBarOpen = false;
      this.ctrl.resizeCanvas();
    });

    fields.openSidebar.addEventListener("click", (e) => {
      this.ctrl.isSideBarOpen = true;
      this.ctrl.resizeCanvas();
    });

    window.onresize = this.ctrl.debounce(
      this.ctrl.resizeCanvas.bind(this.ctrl),
      250
    );

    fields.bigwinName.addEventListener("change", (e) => {
      this.ctrl.bigwin.finalPath = false;
      this.ctrl.name = e.target.value;
      this.ctrl.onAssetsLoaded();
    });

    fields.prettyBtn.addEventListener("click", (e) => {
      this.update();
    });

    document.addEventListener("input", (e) => {
      if (e.target.nodeName === "INPUT") {
        this.update();
      }
    });
    document.addEventListener("change", (e) => {
      if (e.target.nodeName === "INPUT") {
        this.update();
      }
    });

    fields.file.addEventListener("change", (e) => {
      if (!e.target.files.length) return;
      this.loadFiles(e.target.files);
    });

    fields.customFile.addEventListener("change", (e) => {
      const filesArray = [];
      filesArray.push(e.target.files[0]);
      loadFiles(filesArray).then((result) => {
        const keys = Object.keys(result);
        const name = keys[0];
        const bgc = result[name];
        this.ctrl.backgroundImage = bgc.url;
        this.ctrl.changeBackground("customImage");
        this.ctrl.changeBackgroundImage();
      });
    });

    fields.spawnType.addEventListener("change", (e) => {
      this.ctrl.createEmitterArea();
    });
  }

  freshUp() {
    this.ctrl.background = fields.bcgSetup.value;
    this.ctrl.handleTextarea(fields.imageTextarea);
    this.ctrl.handleTextarea(fields.emitterTextarea);
    this.ctrl.updateAssets();
    if (fields.emitterArea.checked) {
      this.ctrl.createEmitterArea();
    }
  }

  update() {
    this.ctrl.useAdvancedConfig = false;
    this.freshUp();
    this.ctrl.changeLinkToDownload();
  }

  loadFiles(myFiles) {
    const filesArray = [];
    for (let i = 0; i < myFiles.length; i++) {
      filesArray.push(myFiles[i]);
    }

    filesArray.sort((a, b) => {
      return a.name.indexOf(".json") - b.name.indexOf(".json");
    });

    loadFiles(filesArray)
      .then((result) => {
        console.log(result);

        this.ctrl.handleLoadData(result);
      })
      .catch((e) => {
        console.error(e);
        alert(e);
      });
  }

  canvasControllers() {
    this.rectangleController();
    this.accelerationController();
    this.speedController();
  }

  rectangleController() {
    const cv = document.querySelector(".emissionRectangle .set_pos");
    const ctx = cv.getContext("2d");
    let emit_flag = 0;

    cv.addEventListener("mousedown", (e) => {
      emit_flag = 1;
    });

    cv.addEventListener("mousemove", (e) => {
      if (emit_flag == 0) {
        return;
      }
      this.ctrl.emitterArea.updateRectangle(e, ctx);
    });

    cv.addEventListener("mouseup", (e) => {
      this.update();
      emit_flag = 0;
    });
  }

  accelerationController() {
    const cv_grav = document.querySelector(".set_acceleration");
    const sliderXTable = document.querySelector(".accelerationXTable");
    const xvalues = sliderXTable.querySelectorAll(".sliderValue");
    const sliderX = xvalues[xvalues.length - 1];
    const sliderYTable = document.querySelector(".accelerationYTable");
    const yvalues = sliderYTable.querySelectorAll(".sliderValue");
    const sliderY = yvalues[yvalues.length - 1];

    const boxsize = 200;
    let grav_flag = 0;

    cv_grav.addEventListener("mousedown", (e) => (grav_flag = 1));

    cv_grav.addEventListener("mousemove", (e) => {
      if (grav_flag == 0) {
        return;
      }
      const rect = e.target.getBoundingClientRect();
      const grav_x = e.clientX - rect.left - boxsize / 2;
      const grav_y = (e.clientY - rect.top - boxsize / 2) * -1;
      sliderX.value = grav_x * 100;
      sliderY.value = -grav_y * 100;
      this.ctrl.cvControls.drawGrav(grav_x * 20, grav_y * 20);
    });

    cv_grav.addEventListener("mouseup", (e) => {
      grav_flag = 0;
      this.update();
    });
  }

  speedController() {
    var angle_x = 0,
      angle_y = 0,
      angle_flag = 0;
    const cv_angle = document.querySelector(".set_speed");
    const boxsize = 200;

    cv_angle.addEventListener("mousedown", (e) => {
      angle_flag = 1;
    });

    cv_angle.addEventListener("mousemove", (e) => {
      if (angle_flag == 0) {
        return;
      }
      const rect = e.target.getBoundingClientRect();

      angle_x = e.clientX - rect.left - boxsize / 2;
      angle_y = e.clientY - rect.top - boxsize / 2;

      angle_x = Math.floor(angle_x * 10);
      angle_y = Math.floor(angle_y * 10);

      const kakudo =
        Math.floor((Math.atan2(angle_y, angle_x) * 180) / Math.PI) * -1;
      const speed = Math.floor(
        Math.sqrt(angle_x * angle_x + angle_y * angle_y)
      );
      const spd = fields.speedTable.querySelector(".sliderValue");
      spd.value = fields.speedTable.querySelector(".slider").value = speed;
      this.ctrl.cvControls.drawAngle(kakudo, speed);
    });

    cv_angle.addEventListener("mouseup", (e) => {
      angle_flag = 0;
      this.update();
    });
  }
}

export default Events;
