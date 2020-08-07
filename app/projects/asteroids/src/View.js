class View {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;

    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
    this.element.append(this.canvas);
  }

  drawSpace() {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.width, this.height);
  }

  drawShip(ship) {
    this.context.strokeStyle = ship.color;
    this.context.beginPath();
    this.context.moveTo(
      // nose of the ship
      ship.x + ship.radius * Math.cos(ship.a),
      ship.y - ship.radius * Math.sin(ship.a)
    );
    this.context.lineTo(
      // rear left
      ship.x - ship.radius * (Math.cos(ship.a) + Math.sin(ship.a)),
      ship.y + ship.radius * (Math.sin(ship.a) - Math.cos(ship.a))
    );
    this.context.lineTo(
      // rear right
      ship.x - ship.radius * (Math.cos(ship.a) - Math.sin(ship.a)),
      ship.y + ship.radius * (Math.sin(ship.a) + Math.cos(ship.a))
    );

    this.context.fillStyle = ship.color;

    this.context.closePath();
    ship.fillShip ? this.context.fill() : this.context.stroke();
  }

  drawAsteroids(asteroids) {
    const numOfAngles = 5;
    for (let i = 0; i < asteroids.length; i++) {
      const r = asteroids[i].radius;
      const x = asteroids[i].x;
      const y = asteroids[i].y;
      this.context.strokeStyle = "white";
      this.context.beginPath();
      this.context.moveTo(
        x + r * Math.cos(Math.PI * 2),
        y + r * Math.sin(Math.PI * 2)
      );
      for (let j = 0; j < 5; j++) {
        this.context.lineTo(
          x + r * Math.cos(Math.PI * 2 + (j * Math.PI * 2) / numOfAngles),
          y + r * Math.sin(Math.PI * 2 + (j * Math.PI * 2) / numOfAngles)
        );
      }
      this.context.closePath();
      this.context.stroke();
    }
  }

  drawBullets(bullets) {
    bullets.forEach((bullet) => {
      this.context.fillStyle = "red";
      this.context.beginPath();
      this.context.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2, false);
      this.context.fill();
    });
  }

  drawScore(score) {
    this.context.textAlign = "start";
    this.context.textBaseline = "top";
    this.context.fillStyle = "white";
    this.context.font = '14px "Press start 2P"';

    this.context.fillText(`Score: ${score}`, 50, 50);
  }

  drawFinalScreen(score) {
    this.clearScreen();
    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("GAME OVER", this.width / 2, this.height / 2 - 48);
    this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
    this.context.fillText(
      `Press ENTER to Restart`,
      this.width / 2,
      this.height / 2 + 48
    );
  }

  clearScreen() {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.width, this.height);
  }
}

export default View;
