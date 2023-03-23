import { Universe } from "game-of-life-wasm";

const pre = document.getElementById("game-of-life-canvas");
const universe = Universe.new(128, 128);

const renderLoop = () => {
  pre.textContent = universe.render();
  universe.tick();

  requestAnimationFrame(renderLoop);
};

// Start the rendering process
requestAnimationFrame(renderLoop);
