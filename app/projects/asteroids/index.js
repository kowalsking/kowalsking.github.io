import Game from "./src/Game.js";
import View from "./src/View.js";
import Controller from "./src/Controller.js";

const root = document.querySelector("#root");

const game = new Game();
const view = new View(root, 900, 562);
new Controller(game, view);
