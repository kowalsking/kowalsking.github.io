import { sayHello } from './greet';
console.log(sayHello('TypeScript'));

const consoleStyle = [
    'background: linear-gradient(to right, #5433ff, #20bdff, #a5fecb);',
    'color: #fff',
    'padding: 10px 20px',
    'line-height: 35px'
].join(';');
console.log('%cHi there!', consoleStyle);

function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
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