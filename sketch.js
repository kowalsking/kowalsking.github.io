stars = [];
let speed;

function setup() {
  let ww = windowWidth;
  let wh = windowHeight;

  createCanvas(ww,wh);
  for (let i = 0; i < 800; i++) {
    stars[i] = new Star();
  }

  setInterval(function() {
    let ww1 = windowWidth;
    let wh1 = windowHeight;
    if ( ww !== ww1 || wh !== wh1){
      createCanvas(ww1,wh1);
      draw()
    }
  },100);
}

function draw() {
  speed = 5;
  background(0);
  translate(width / 2, height / 2);
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
}