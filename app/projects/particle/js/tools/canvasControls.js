import fields from "../fields.js";

class cavasControlls {
  constructor() {
    this.boxsize = 200;

    this.chooseFields();
    this.setupAcceleration();
    this.setupSpeed();
  }

  chooseFields() {
    const sliderXTable = document.querySelector(".accelerationXTable");
    const xvalues = sliderXTable.querySelectorAll(".sliderValue");
    this.X = +xvalues[xvalues.length - 1].value;
    const sliderYTable = document.querySelector(".accelerationYTable");
    const yvalues = sliderYTable.querySelectorAll(".sliderValue");
    this.Y = +yvalues[yvalues.length - 1].value;
  }

  setupAcceleration() {
    this.cv_grav = document.querySelector(".set_acceleration");
    this.ctx_grav = this.cv_grav.getContext("2d");

    this.cv_grav.setAttribute("width", this.boxsize);
    this.cv_grav.setAttribute("height", this.boxsize);
    this.ctx_grav.scale(1, 1);
    this.drawGrav(this.X / 5, this.Y / 5);
  }

  drawGrav(xx, yy) {
    xx = Math.floor(xx);
    yy = -Math.floor(yy);

    //中心から線を引く
    this.ctx_grav.clearRect(0, 0, this.boxsize, this.boxsize);
    this.ctx_grav.beginPath();
    this.ctx_grav.strokeStyle = " rgb(255,88,88) ";
    this.ctx_grav.moveTo(this.boxsize / 2, this.boxsize / 2);
    this.ctx_grav.lineTo(
      this.boxsize / 2 + xx / 20,
      this.boxsize / 2 + yy / 20
    );
    this.ctx_grav.closePath();
    this.ctx_grav.stroke();
    this.X = xx * 5;
    this.Y = yy * 5;
  }

  setupSpeed() {
    const cv_angle = document.querySelector(".set_speed");
    this.ctx_angle = cv_angle.getContext("2d");
    cv_angle.setAttribute("width", this.boxsize);
    cv_angle.setAttribute("height", this.boxsize);
    this.ctx_angle.scale(1, 1);
    const kakudo = 0;
    const actualSpd = +document
      .querySelector(".speedTable")
      .querySelector(".sliderValue").value;

    this.drawAngle(kakudo, actualSpd);
  }

  drawAngle(kakudo, speed) {
    kakudo = parseInt(kakudo);
    speed = parseInt(speed);

    const rad = parseFloat((kakudo * Math.PI) / 180);

    //線を引く
    this.ctx_angle.clearRect(0, 0, this.boxsize, this.boxsize);

    const to_x = this.boxsize / 2 + (Math.cos(rad) * speed) / 10;
    const to_y = this.boxsize / 2 - (Math.sin(rad) * speed) / 10;
    //speed,angle
    this.ctx_angle.beginPath();
    this.ctx_angle.strokeStyle = " rgb(255,88,88) ";
    this.ctx_angle.moveTo(this.boxsize / 2, this.boxsize / 2);
    this.ctx_angle.lineTo(to_x, to_y);
    this.ctx_angle.closePath();
    this.ctx_angle.stroke();

    //angleVarの円弧
    this.ctx_angle.beginPath();
    const anglevar = +fields.angleWidth.value / 2;

    fields.angleWidth.dataset.from = -(kakudo - anglevar);
    fields.angleWidth.dataset.to = -(kakudo + anglevar);
    const rad_from = (((kakudo - anglevar) * Math.PI) / 180) * -1;
    const rad_to = (((kakudo + anglevar) * Math.PI) / 180) * -1;

    document.querySelector(".angleFrom").textContent = -(kakudo - anglevar);
    document.querySelector(".angleTo").textContent = -(kakudo + anglevar);

    this.ctx_angle.arc(
      this.boxsize / 2,
      this.boxsize / 2,
      30,
      rad_from,
      rad_to,
      true
    ); // x , y , 半径 , 開始度ラジアン , 終了度ラジアン , true
    this.ctx_angle.stroke();

    //speedVar
    this.ctx_angle.beginPath();
    this.ctx_angle.strokeStyle = " rgb(150,150,150) ";
    this.ctx_angle.moveTo(
      to_x - Math.cos(rad) / 10 + Math.sin(rad) * 3,
      to_y + Math.sin(rad) / 10 + Math.cos(rad) * 3
    );
    this.ctx_angle.lineTo(
      to_x + Math.cos(rad) / 10 + Math.sin(rad) * 3,
      to_y - Math.sin(rad) / 10 + Math.cos(rad) * 3
    );
    this.ctx_angle.closePath();

    this.ctx_angle.stroke();
  }
}

export default cavasControlls;
