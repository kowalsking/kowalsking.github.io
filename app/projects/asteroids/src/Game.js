class Game {
  constructor() {}

  markBoundaries(w, h) {
    this.width = w;
    this.height = h;
  }

  createConfig() {
    return (this.config = {
      shipSize: 30,
      fps: 30,
      rotationSpd: this.degreesToRadians(360),
      acceleration: 5,
      braking: 0.7,
      astrSize: 100,
      astrSpd: 50,
      astrNum: 4,
      bulletSpd: 500,
    });
  }

  createShip() {
    const size = this.config.shipSize;
    return {
      color: "#FFCC00",
      x: this.width / 2,
      y: this.height / 2,
      fillShip: true,
      size: size,
      radius: size / 2,
      a: this.degreesToRadians(90),
      rotation: 0,
      moving: false,
      canShoot: true,
      bullets: [],
      pos: {
        x: 0,
        y: 0,
      },
    };
  }

  getState() {
    return {
      score: 0,
      isGameOver: false,
    };
  }

  newAsteroid(x, y, r = this.config.astrSize / 2) {
    const velocity = (Math.random() * this.config.astrSpd) / this.config.fps;
    return {
      x: x,
      y: y,
      radius: r,
      xv: velocity * this.changeDirection(),
      yv: velocity * this.changeDirection(),
    };
  }

  createAsteroids() {
    const allAsteroids = [];
    for (let i = 0; i < this.config.astrNum; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      allAsteroids.push(this.newAsteroid(x, y));
    }
    return allAsteroids;
  }

  shootBullets(ship) {
    const fps = this.config.fps;
    const speed = this.config.bulletSpd;

    const bullet = {
      x: ship.x + ship.radius * Math.cos(ship.a),
      y: ship.y - ship.radius * Math.sin(ship.a),
      size: 2,
      xv: (speed * Math.cos(ship.a)) / fps,
      yv: (-speed * Math.sin(ship.a)) / fps,
    };

    return ship.bullets.push(bullet);
  }

  checkCollision(state, ship, asteroids) {
    asteroids.forEach((roid) => {
      const dbp = this.distBetweenPoints(ship.x, ship.y, roid.x, roid.y); // dist between points
      const dbsr = ship.radius + roid.radius; // dist between ship & roid
      if (dbp < dbsr) {
        state.isGameOver = true;
      }
    });
  }

  shellHit(state, bullets, asteroids) {
    bullets.forEach((bullet, bindex) => {
      asteroids.forEach((roid, rindex) => {
        const dbbr = this.distBetweenPoints(bullet.x, bullet.y, roid.x, roid.y);
        if (dbbr < roid.radius) {
          state.score += 10;
          this.destroyAsteroid(asteroids, rindex);
          this.destroyBullet(bullets, bindex);
        }
      });
    });
  }

  destroyAsteroid(asteroids, i) {
    const r = asteroids[i].radius;
    const size = this.config.astrSize;
    if (r === size / 2 || r === size / 4) {
      this.splitInTwo(asteroids, i);
    }
    asteroids.splice(i, 1);
  }

  destroyBullet(bullets, i) {
    bullets.splice(i, 1);
  }

  splitInTwo(asteroids, i) {
    const roid = asteroids[i];
    asteroids.push(this.newAsteroid(roid.x, roid.y, roid.radius / 2));
    asteroids.push(this.newAsteroid(roid.x, roid.y, roid.radius / 2));
    // return asteroids;
  }

  changeDirection() {
    return Math.random() < 0.5 ? 1 : -1;
  }

  distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  degreesToRadians(n) {
    return (n / 180) * Math.PI;
  }

  handleEdgeOfSpace(entities) {
    entities.forEach((entity) => {
      if (entity.x < 0 - entity.radius) {
        entity.x = this.width + entity.radius;
      } else if (entity.x > this.width + entity.radius) {
        entity.x = 0 - entity.radius;
      }

      if (entity.y < 0 - entity.radius) {
        entity.y = this.height + entity.radius;
      } else if (entity.y > this.height + entity.radius) {
        entity.y = 0 - entity.radius;
      }
    });
  }
}

export default Game;
