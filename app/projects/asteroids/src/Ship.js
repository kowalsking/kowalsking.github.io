class Ship {
  constructor(config) {
    this.config = config;
  }

  create(w, h, s) {
    return (this.ship = {
      color: "#FFCC00",
      x: w / 2,
      y: h / 2,
      fillShip: true,
      size: s,
      radius: s / 2,
      a: this.degreesToRadians(90),
      rotation: 0,
      moving: false,
      bullets: [],
      pos: {
        x: 0,
        y: 0,
      },
    });
  }

  push() {
    const acceleration = this.config.acceleration;
    const fps = this.config.fps;
    this.ship.pos.x += (acceleration * Math.cos(this.ship.a)) / fps;
    this.ship.pos.y -= (acceleration * Math.sin(this.ship.a)) / fps;
  }

  brake() {
    const fps = this.config.fps;
    const braking = this.config.braking;
    this.ship.pos.x -= (braking * this.ship.pos.x) / fps;
    this.ship.pos.y -= (braking * this.ship.pos.y) / fps;
  }

  rotate() {
    this.ship.a += this.ship.rotation;
  }

  move() {
    this.ship.x += this.ship.pos.x;
    this.ship.y += this.ship.pos.y;
  }

  moveBullet() {
    this.ship.bullets.forEach((bullet) => {
      bullet.x += bullet.xv;
      bullet.y += bullet.yv;
    });
  }

  shoot() {
    const fps = this.config.fps;
    const speed = this.config.bulletSpd;

    const bullet = {
      x: this.ship.x + this.ship.radius * Math.cos(this.ship.a),
      y: this.ship.y - this.ship.radius * Math.sin(this.ship.a),
      size: 2,
      xv: (speed * Math.cos(this.ship.a)) / fps,
      yv: (-speed * Math.sin(this.ship.a)) / fps,
    };

    return this.ship.bullets.push(bullet);
  }

  degreesToRadians(n) {
    return (n / 180) * Math.PI;
  }
}

export default Ship;
