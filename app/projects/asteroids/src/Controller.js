import Game from "./Game";
import View from "./View";

class Controller {
  constructor() {
    this.game = new Game();
    this.view = new View();

    this.game.markBoundaries(this.view.canvas.width, this.view.canvas.height);

    this.init();
  }

  init() {
    this.setup();
    this.onResize();
    requestAnimationFrame((time) => this.update(time));
  }

  setup() {
    this.prevUpdateTime = 0;
    this.setupConfig();
    this.setupShip();
    this.setupAsteroids();
    this.setupStateOfGame();
    this.eventsHandlers();
  }

  setupConfig() {
    this.config = this.game.createConfig();
  }

  setupShip() {
    this.ship = this.game.createShip();
  }

  setupAsteroids() {
    this.allAsteroids = this.game.createAsteroids();
  }

  setupStateOfGame() {
    this.state = this.game.getState();
  }

  eventsHandlers() {
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  update(time) {
    this.updateView();
    this.updateMoving();
    this.checkCollision();
    this.checkIsGameOver();

    this.prevUpdateTime = time;

    requestAnimationFrame((time) => this.update(time));
  }

  updateView() {
    this.view.clearScreen();
    this.view.drawShip(this.ship);
    this.view.drawAsteroids(this.allAsteroids);
    this.view.drawBullets(this.ship.bullets);
    this.view.drawScore(this.state.score);
  }

  updateMoving() {
    this.ship.moving ? this.pushTheShip() : this.brakeTheShip();
    this.rotateShip();
    this.moveShip();
    this.moveAsteroids();
    this.moveBullet();
  }

  checkCollision() {
    this.game.checkCollision(this.state, this.ship, this.allAsteroids);
    this.game.shellHit(this.state, this.ship.bullets, this.allAsteroids);
    this.game.handleEdgeOfSpace([this.ship]);
    this.game.handleEdgeOfSpace(this.allAsteroids);
    this.game.checkBulletsOutOfScreen(this.ship.bullets);
  }

  checkIsGameOver() {
    if (this.state.isGameOver) {
      this.stopGame();
    }
  }

  pushTheShip() {
    const acceleration = this.config.acceleration;
    const fps = this.config.fps;
    this.ship.pos.x += (acceleration * Math.cos(this.ship.a)) / fps;
    this.ship.pos.y -= (acceleration * Math.sin(this.ship.a)) / fps;
  }

  brakeTheShip() {
    const fps = this.config.fps;
    const braking = this.config.braking;
    this.ship.pos.x -= (braking * this.ship.pos.x) / fps;
    this.ship.pos.y -= (braking * this.ship.pos.y) / fps;
  }

  rotateShip() {
    this.ship.a += this.ship.rotation;
  }

  moveShip() {
    this.ship.x += this.ship.pos.x;
    this.ship.y += this.ship.pos.y;
  }

  moveAsteroids() {
    this.allAsteroids.forEach((roid) => {
      roid.x += roid.xv;
      roid.y += roid.yv;
    });
  }

  moveBullet() {
    this.ship.bullets.forEach((bullet) => {
      bullet.x += bullet.xv;
      bullet.y += bullet.yv;
    });
  }

  onResize() {
    const width = this.view.container.clientWidth;
    const height = this.view.container.clientHeight;

    this.view.updateCanvasDimensions();
    this.game.markBoundaries(width, height);
  }

  restart() {
    this.ship = this.game.createShip();
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
        this.game.shootBullets(this.ship);
        break;
      case 37: // left
        this.ship.rotation = rotationSpd / fps;
        break;
      case 38: // up
        this.ship.moving = true;
        break;
      case 39: // right
        this.ship.rotation = -rotationSpd / fps;
        break;
    }
  }

  keyUp(e) {
    switch (e.keyCode) {
      case 37: // left
        this.ship.rotation = 0;
        break;
      case 38: // up
        this.ship.moving = false;
        break;
      case 39: // right
        this.ship.rotation = 0;
        break;
    }
  }

  stopGame() {
    this.view.drawFinalScreen(this.state.score);
  }
}

export default Controller;
