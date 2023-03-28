import { set_panic_hook, Universe } from "game-of-life-wasm";
import { memory } from "game-of-life-wasm/game_of_life_wasm_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const width = 256;
const height = 256;
const universe = Universe.with_random_start(width, height, 0.28);

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

const fps = 30;
const fpsInterval = Math.round(1000 / fps / 16.66);
let frameCount = 0;

// initial cells
const init_rows = [1, 2, 3, 3, 3];
const init_cols = [2, 3, 1, 2, 3];

const set_universe = (rows, cols) => {
  for (let idx = 0; idx < rows.length; idx++) {
    let row = rows[idx];
    let col = cols[idx];
    universe.set_cell(row, col);
  }
};

const getIndex = (row, column) => {
  return row * width + column;
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  ctx.beginPath();

  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      const idx = getIndex(row, col);

      ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};
const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines
  for (let j = 0; j <= height; ++j) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const renderLoop = () => {
  frameCount++;
  if (frameCount % fpsInterval === 0) {
    frameCount = 0;
    universe.tick();
    drawGrid();
    drawCells();
  }
  requestAnimationFrame(renderLoop);
};

// for debuging, we set the panic hook
set_panic_hook();

// Start the rendering process
set_universe(init_rows, init_cols);
drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
