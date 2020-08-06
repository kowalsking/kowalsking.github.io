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
    this.context.strokeStyle = "yellow";
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

    this.context.fillStyle = "#FFCC00";

    this.context.closePath();
    ship.fillShip ? this.context.fill() : this.context.stroke();
  }

  drawAsteroids(asteroids) {
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
      for (let j = 0; j < 6; j++) {
        this.context.lineTo(
          x + r * Math.cos(Math.PI * 2 + (j * Math.PI * 2) / 5),
          y + r * Math.sin(Math.PI * 2 + (j * Math.PI * 2) / 5)
        );
      }
      this.context.closePath();
      this.context.stroke();
    }
  }
}

export default View;
