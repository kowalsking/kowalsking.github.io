class View {
  constructor() {
    this.setupCanvas();
  }

  setupCanvas() {
    this.container = document.getElementById("content");
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.updateCanvasDimensions();
    this.container.append(this.canvas);
  }

  updateCanvasDimensions() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  drawShip(ship) {
    this.ctx.strokeStyle = ship.color;
    this.ctx.beginPath();
    this.ctx.moveTo(
      // nose of the ship
      ship.x + ship.radius * Math.cos(ship.a),
      ship.y - ship.radius * Math.sin(ship.a)
    );
    this.ctx.lineTo(
      // rear left
      ship.x - ship.radius * (Math.cos(ship.a) + Math.sin(ship.a)),
      ship.y + ship.radius * (Math.sin(ship.a) - Math.cos(ship.a))
    );
    this.ctx.lineTo(
      // rear right
      ship.x - ship.radius * (Math.cos(ship.a) - Math.sin(ship.a)),
      ship.y + ship.radius * (Math.sin(ship.a) + Math.cos(ship.a))
    );

    this.ctx.fillStyle = ship.color;

    this.ctx.closePath();
    ship.fillShip ? this.ctx.fill() : this.ctx.stroke();
  }

  drawAsteroids(asteroids) {
    const numOfAngles = 5;
    asteroids.forEach((roid) => {
      const r = roid.radius;
      const x = roid.x;
      const y = roid.y;
      this.ctx.strokeStyle = "white";
      this.ctx.beginPath();
      this.ctx.moveTo(
        x + r * Math.cos(Math.PI * 2),
        y + r * Math.sin(Math.PI * 2)
      );
      for (let j = 0; j < 5; j++) {
        this.ctx.lineTo(
          x + r * Math.cos(Math.PI * 2 + (j * Math.PI * 2) / numOfAngles),
          y + r * Math.sin(Math.PI * 2 + (j * Math.PI * 2) / numOfAngles)
        );
      }
      this.ctx.closePath();
      this.ctx.stroke();
    });
  }

  drawBullets(bullets) {
    bullets.forEach((bullet) => {
      this.ctx.fillStyle = "red";
      this.ctx.beginPath();
      this.ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2, false);
      this.ctx.fill();
    });
  }

  drawScore(score) {
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "white";
    this.ctx.font = '14px "Press start 2P"';

    this.ctx.fillText(`Score: ${score}`, 50, 50);
  }

  drawFinalScreen(score) {
    this.clearScreen();
    this.ctx.fillStyle = "white";
    this.ctx.font = '18px "Press Start 2P"';
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - 48
    );
    this.ctx.fillText(
      `Score: ${score}`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.fillText(
      `Press ENTER to Restart`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 48
    );
  }

  clearScreen() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default View;
