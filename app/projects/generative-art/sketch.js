import canvasSketch from "./canvas-sketch.js";
import { lerp } from "./canvas-sketch-util/math";
import random from "./canvas-sketch-util/random";
import palettes from "./nice-color-palettes";

// Sketch parameters
const settings = {
  dimensions: [2048, 2048],
};

// Artwork function
const sketch = () => {
  // const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes));

  const createGrid = () => {
    const points = [];
    const count = 20;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // const u = count <= 1 ? 0.5 : x / (count - 1);
        // const v = count <= 1 ? 0.5 : y / (count - 1);
        // const radius = Math.abs(random.noise2D(u, v)) * 0.1;
        const radius = 100;
        const u = x / (count - 1);
        const v = y / (count - 1);
        points.push({
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v],
        });
      }
    }
    return points;
  };

  // const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 200;
  const points = createGrid();

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;

      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      // context.fillRect(x, y, radius * width, radius * height);
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      // context.rotate(rotation);
      context.lineWidth = 20;
      context.strokeStyle = color;
      context.fillStyle = color;
      context.stroke();

      // context.save();
      // context.fillStyle = color;
      // context.font = `${radius * width}px "Helvetica"`;
      // context.translate(x, y);
      // context.rotate(rotation);
      // context.fillText("l", 0, 0);
      // context.restore();
    });
  };
};

// Start the sketch
canvasSketch(sketch, settings);
