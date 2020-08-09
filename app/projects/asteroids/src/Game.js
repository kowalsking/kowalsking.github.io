import Ship from "./Ship";
import Asteroid from "./Asteroid";

class Game {
  constructor() {}

  markBoundaries(w, h) {
    this.width = w;
    this.height = h;
  }

  setup() {
    this.prevUpdateTime = 0;
    this.setupConfig();
    this.setupShip();
    this.setupAsteroids();
    this.setupStateOfGame();
  }

  setupConfig() {
    this.config = this.createConfig();
  }

  setupShip() {
    const w = this.width;
    const h = this.height;
    const s = this.config.shipSize;
    this.ship = new Ship(this.config);
    this.ship.body = this.ship.create(w, h, s);
  }

  setupAsteroids() {
    this.allAsteroids = this.createAsteroids();
  }

  setupStateOfGame() {
    this.state = this.getState();
  }

  createConfig() {
    return (this.config = {
      shipSize: 30,
      fps: 60,
      rotationSpd: this.degreesToRadians(360),
      acceleration: 6,
      braking: 0.7,
      astrSize: 100,
      astrSpd: 70,
      astrNum: 6,
      bulletSpd: 500,
    });
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

  moveAsteroids(asteroids) {
    asteroids.forEach((roid) => {
      roid.x += roid.xv;
      roid.y += roid.yv;
    });
  }

  createAsteroids() {
    const allAsteroids = [];
    for (let i = 0; i < this.config.astrNum; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const r = this.config.astrSize;
      const asteroid = new Asteroid(this.config);
      allAsteroids.push(asteroid.create(x, y));
    }
    return allAsteroids;
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

  removeBulletsOutOfScreen(bullets) {
    bullets.forEach((b, i) => {
      const out = b.x < 0 || b.x > this.width || b.y < 0 || b.y > this.height;

      if (out) {
        bullets.splice(i, 1);
      }
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

  restart() {
    this.setupShip();
    this.prevUpdateTime = 0;
    this.setupAsteroids();
    this.setupStateOfGame();
  }

  keyDown(e) {
    const rotationSpd = this.config.rotationSpd;
    const fps = this.config.fps;
    switch (e.keyCode) {
      case 13: // enter
        if (this.state.isGameOver) {
          this.restart();
        }
        break;
      case 32: // space
        this.ship.shoot();
        break;
      case 37: // left
        this.ship.body.rotation = rotationSpd / fps;
        break;
      case 38: // up
        this.ship.body.moving = true;
        break;
      case 39: // right
        this.ship.body.rotation = -rotationSpd / fps;
        break;
    }
  }

  keyUp(e) {
    switch (e.keyCode) {
      case 37: // left
        this.ship.body.rotation = 0;
        break;
      case 38: // up
        this.ship.body.moving = false;
        break;
      case 39: // right
        this.ship.body.rotation = 0;
        break;
    }
  }
}

export default Game;
