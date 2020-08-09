import Game from "./Game";
import View from "./View";

class Controller {
  constructor() {
    this.game = new Game();
    this.view = new View();

    this.width = this.view.canvas.width;
    this.height = this.view.canvas.height;

    this.game.markBoundaries(this.width, this.height);

    this.init();
  }

  init() {
    this.game.setup();
    this.eventsHandlers();
    this.onResize();
    requestAnimationFrame((time) => this.update(time));
  }

  eventsHandlers() {
    document.addEventListener("keydown", (e) => {
      this.game.keyDown(e);
    });
    document.addEventListener("keyup", (e) => {
      this.game.keyUp(e);
    });
    window.addEventListener("resize", () => {
      this.onResize();
    });
  }

  update(time) {
    this.updateView();
    this.updateMoving();
    this.checkCollision();
    this.checkIsGameOver();

    this.game.prevUpdateTime = time;

    requestAnimationFrame((time) => this.update(time));
  }

  updateView() {
    this.view.clearScreen();
    this.view.drawShip(this.game.ship.body);
    this.view.drawAsteroids(this.game.allAsteroids);
    this.view.drawBullets(this.game.ship.body.bullets);
    this.view.drawScore(this.game.state.score);
  }

  updateMoving() {
    this.game.ship.body.moving ? this.game.ship.push() : this.game.ship.brake();
    this.game.ship.rotate();
    this.game.ship.move();
    this.game.ship.moveBullet();
    this.game.moveAsteroids(this.game.allAsteroids);
  }

  checkCollision() {
    const ship = this.game.ship.body;
    this.game.checkCollision(this.game.state, ship, this.game.allAsteroids);
    this.game.shellHit(this.game.state, ship.bullets, this.game.allAsteroids);
    this.game.handleEdgeOfSpace([ship]);
    this.game.handleEdgeOfSpace(this.game.allAsteroids);
    this.game.removeBulletsOutOfScreen(ship.bullets);
  }

  checkIsGameOver() {
    if (this.game.state.isGameOver) {
      this.stopGame();
    }
  }

  onResize() {
    const width = this.view.container.clientWidth;
    const height = this.view.container.clientHeight;
    this.view.updateCanvasDimensions();
    this.game.markBoundaries(width, height);
  }

  stopGame() {
    this.view.drawFinalScreen(this.game.state.score);
  }
}

export default Controller;
