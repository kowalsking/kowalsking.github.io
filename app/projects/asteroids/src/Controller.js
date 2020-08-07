class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;

    this.game.markBoundaries(this.view.width, this.view.height);

    this.setup();
    this.update();
  }

  setup() {
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
    this.state = this.game.getState(this.allAsteroids);
  }

  eventsHandlers() {
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
  }

  update() {
    setInterval(() => {
      this.view.drawSpace();
      this.view.drawShip(this.ship);
      this.view.drawAsteroids(this.allAsteroids);

      this.ship.moving ? this.pushTheShip() : this.brakeTheShip();

      this.rotateShip();
      this.moveShip();
      this.moveAsteroids();

      if (this.state.isGameOver) {
        this.stopGame();
      }

      this.game.checkCollision(this.state, this.ship, this.allAsteroids);
      this.game.handleEdgeOfSpace([this.ship]);
      this.game.handleEdgeOfSpace(this.allAsteroids);
    }, 1000 / this.config.fps);
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

  keyDown(e) {
    const rotationSpd = this.config.rotationSpd;
    const fps = this.config.fps;
    switch (e.keyCode) {
      case 13: // ENTER
        if (this.state.isGameOver) {
          this.setup();
        }
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
    this.view.drawFinalScreen();
  }
}

export default Controller;