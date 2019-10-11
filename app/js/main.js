"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var greet_1 = require("./greet");
console.log(greet_1.sayHello('TypeScript'));
var consoleStyle = [
    'background: linear-gradient(to right, #5433ff, #20bdff, #a5fecb);',
    'color: #fff',
    'padding: 10px 20px',
    'line-height: 35px'
].join(';');
console.log('%cHi there!', consoleStyle);
function hello(compiler) {
    console.log("Hello from " + compiler);
}
// hello('TypeScript');
// function logotype() {
//     let logo = document.querySelector('.logo');
//     logo.addEventListener('click', (e) => {
//         e.preventDefault();
//         console.log(this);
//         logo.classList.toggle('coolLogo')
//     });
// }
//
// logotype();
