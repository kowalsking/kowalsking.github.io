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
    });
  }

  createShip() {
    const size = this.config.shipSize;
    return {
      x: this.width / 2,
      y: this.height / 2,
      fillShip: true,
      size: size,
      radius: size / 2,
      a: this.degreesToRadians(90),
      rotation: 0,
      moving: false,
      pos: {
        x: 0,
        y: 0,
      },
    };
  }

  newAsteroid(x, y) {
    const radius = this.config.astrSize / 2;
    const velocity = (Math.random() * this.config.astrSpd) / this.config.fps;
    return {
      x: x,
      y: y,
      radius: radius,
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

  checkCollision(ship, asteroids) {
    asteroids.forEach((roid) => {
      const dbp = this.distBetweenPoints(ship.x, ship.y, roid.x, roid.y); // dist between points
      const dbsr = ship.radius + roid.radius; // dist between ship & roid
      if (dbp < dbsr) {
        ship.fillShip = false;
        return;
      } else if (dbp > dbsr) {
        ship.fillShip = true;
      }
    });
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
