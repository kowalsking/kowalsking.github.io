window.addEventListener('DOMContentLoaded', () => {
    let src = document.getElementById('images').getElementsByTagName('img'),
    img = function img(el, x, y){
        let d = document.createElement('div');
        d.className = 'frame';
        d.style.left = 50 * x + '%';
        d.style.top = 50 * y + '%';
        let img = document.createElement('img');
        img.className = 'img';
        img.src = src[Math.floor(Math.random()*src.length)].src;
        img.onmousedown = function () {
            div(this.parentNode);
            this.parentNode.removeChild(this);
        }
        d.appendChild(img);
        el.appendChild(d);
    },
    div = function div (el) {
        img(el,0,0);
        img(el,1,0);
        img(el,0,1);
        img(el,1,1);
    };
    div(document.getElementById('screen'));
    window.ondragstart = () => { false }
}, false);