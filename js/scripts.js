var tilesetImage = document.getElementById("tileset-source");
const tilesetContainer = document.querySelector(".tileset-container");
const tilesetSelection = document.querySelector(".tileset-container-selection");
const selectionCanvas = document.querySelector(".selectionCanvas");
const tilesetCanvas = document.getElementById("tileset-canvas");
var canvas = document.querySelector("#editor-canvas");
const imgSrc = "./assets/demo_tileset_16x16.png";

// tilemap selection size will depend on pixelUnit
const pixelUnit = 16;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

window.onload = function () {
  tilesetSelection.style.width = `${pixelUnit}px`;
  tilesetSelection.style.height = `${pixelUnit}px`;
};

document.querySelectorAll(".inputWidth, .inputHeight").forEach((input) => {
  input.addEventListener("input", updateCanvasSize);
});

let selection = [0, 0];
let currentLayer = 0;
let isMouseDown = false;
const isLayerBlocked = [false, false, false];
let layers = [
  {
    //Layer Structure is "x-y": ["tileset_x", "tileset_y"]
    //EXAMPLE: "1-1": [3, 4],
  },
  //Middle layer with same structure
  {},
  //Top layer with same structure
  {},
];
let stateHistory = [{}, {}, {}];

function preset() {
  setLayer(0);
}

function getContext() {
  const ctx = canvas.getContext("2d");
  return ctx;
}

function setLayer(newLayer) {
  currentLayer = Number(newLayer);

  oldActivedLayer = document.querySelector(".layer.active");
  if (oldActivedLayer) {
    oldActivedLayer.classList.remove("active");
  }

  document
    .querySelector(`.layer[tile-layer="${newLayer}"]`)
    .classList.add("active");
}

function setLayerIsBlock(layer) {
  const layerNumber = Number(layer);
  isLayerBlocked[layerNumber] = !isLayerBlocked[layerNumber];

  document
    .querySelector(`.padlock[padlock-layer="${layer}"]`)
    .classList.toggle("close", isLayerBlocked[layerNumber]);
}

tilesetContainer.addEventListener("mousedown", (e) => {
  selection = getCoordinates(e);
  updateSelection();
});

function updateSelection() {
  tilesetSelection.style.left = selection[0] * pixelUnit + "px";
  tilesetSelection.style.top = selection[1] * pixelUnit + "px";
}

function getCoordinates(event) {
  const { x, y } = event.target.getBoundingClientRect();
  const selectionX = Math.floor(Math.max(event.clientX - x, 0) / pixelUnit);
  const selectionY = Math.floor(Math.max(event.clientY - y, 0) / pixelUnit);

  return [selectionX, selectionY];
}

function draw() {
  const ctx = getContext();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.imageSmoothingEnabled = false;

  layers.forEach((layer) => {
    Object.keys(layer).forEach((key) => {
      const [positionX, positionY] = key.split("-").map(Number);
      const [tilesheetX, tilesheetY] = layer[key];

      ctx.drawImage(
        tilesetImage,
        tilesheetX * pixelUnit,
        tilesheetY * pixelUnit,
        pixelUnit,
        pixelUnit,
        positionX * pixelUnit,
        positionY * pixelUnit,
        pixelUnit,
        pixelUnit
      );
    });
  });
}

function tilesetSelect() {
  const ctx = tilesetCanvas.getContext("2d");

  // Scale the canvas if necessary
  const scale = pixelUnit === 16 ? 2 : 1;
  tilesetCanvas.width = tilesetImage.width * scale;
  tilesetCanvas.height = tilesetImage.height * scale;

  // Disable anti-aliasing
  ctx.imageSmoothingEnabled = false;

  ctx.clearRect(0, 0, tilesetCanvas.width, tilesetCanvas.height);
  ctx.drawImage(
    tilesetImage,
    0,
    0,
    tilesetImage.width,
    tilesetImage.height,
    0,
    0,
    tilesetCanvas.width,
    tilesetCanvas.height
  );

  // Add event listeners for mouse drag
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  function initStart(event) {
    startX =
      Math.floor(event.offsetX / (pixelUnit * scale)) * (pixelUnit * scale);
    startY =
      Math.floor(event.offsetY / (pixelUnit * scale)) * (pixelUnit * scale);
  }

  function initEnd(event) {
    endX =
      Math.floor(event.offsetX / (pixelUnit * scale)) * (pixelUnit * scale);
    endY =
      Math.floor(event.offsetY / (pixelUnit * scale)) * (pixelUnit * scale);
    drawSelectionRect(ctx, startX, startY, endX, endY);
  }

  let regClick = true;

  tilesetCanvas.addEventListener("click", (event) => {
    if (!isDragging) {
      event.preventDefault();
      // Execute click event callback code
      console.log("clicked event");
      // initStart(event);
      initEnd(event);
    }
  });

  tilesetCanvas.addEventListener("mousedown", (event) => {
    regClick = true;
    isDragging = true;
    initStart(event);
  });

  selectionCanvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
      regClick = false;
      initEnd(event);
    }

    // console.log(startX, startY);
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      regClick = false;
      const selectedTiles = getSelectedTiles(startX, startY, endX, endY);
    }
  });

  // Draw a selection rectangle between two points
  function drawSelectionRect(ctx, startX, startY, endX, endY) {
    ctx.clearRect(0, 0, tilesetCanvas.width, tilesetCanvas.height);
    ctx.drawImage(
      tilesetImage,
      0,
      0,
      tilesetImage.width,
      tilesetImage.height,
      0,
      0,
      tilesetCanvas.width,
      tilesetCanvas.height
    );

    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;

    let x = endX - startX;
    let y = endY - startY;

    if (x < pixelUnit * scale || y < pixelUnit * scale) {
      x = pixelUnit * scale;
      y = pixelUnit * scale;
      // console.log(`x: ${x} y: ${y}`);
    }

    ctx.strokeRect(startX, startY, x, y);

    console.log(x, y);
  }

  // Get an array of selected tile positions
  function getSelectedTiles(startX, startY, endX, endY) {
    const selectedTiles = [];
    for (let x = startX; x <= endX; x += pixelUnit * scale) {
      for (let y = startY; y <= endY; y += pixelUnit * scale) {
        selectedTiles.push({ x, y });
      }
    }
    return selectedTiles;
  }
}

canvas.addEventListener("mousedown", setMouseIsTrue);
canvas.addEventListener("mouseup", setMouseIsFalse);
canvas.addEventListener("mouseleave", setMouseIsFalse);
canvas.addEventListener("mousedown", toggleTile);
canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    toggleTile(e);
  }
});

function setMouseIsTrue() {
  isMouseDown = true;
}

function setMouseIsFalse() {
  isMouseDown = false;
}

function toggleTile(event) {
  if (isLayerBlocked[currentLayer]) {
    return;
  }

  const clicked = getCoordinates(event);
  const key = clicked[0] + "-" + clicked[1];
  const isArray = (likely) => Array.isArray(likely) && likely[0] !== undefined;

  updateStateHistory(key, isArray);

  // switch brushs
  if (currentBrush == 1) {
    addTile(key);
  } else if (currentBrush == 2) {
    removeTile(key);
  } else if (currentBrush == 3) {
    console.log("bucket fill tool");
  } else if (currentBrush == 4) {
    getTile(key);
  }

  draw();
}

function addTile(key) {
  layers[currentLayer][key] = selection;
}

function getTile(key) {
  const clicked = layers[currentLayer][key];

  if (clicked) {
    selection = clicked;
    updateSelection();
  }
}

function removeTile(key) {
  delete layers[currentLayer][key];
}

function updateStateHistory(key, isArray) {
  const tileHistory = stateHistory[currentLayer][key];

  const selected = layers[currentLayer][key];
  if (isArray(tileHistory)) {
    if (
      selected &&
      !(selected[0] === selection[0] && selected[1] === selection[1])
    ) {
      stateHistory[currentLayer][key].push(selected);
    }
  } else {
    stateHistory[currentLayer][key] = [[5, 17]];
  }
}

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "z") {
    undoLastAction();
  }
});

let currentStateIndex = -1;

function updateStateHistory() {
  currentStateIndex++;
  if (currentStateIndex < stateHistory.length) {
    stateHistory.splice(currentStateIndex);
  }
  const state = JSON.parse(JSON.stringify(layers)); // make a deep copy of the current state
  stateHistory.push(state);
}

// only removes the last tile once and it should go back to previous state unless the canvas is empty
function undoLastAction() {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    layers = JSON.parse(JSON.stringify(stateHistory[currentStateIndex])); // make a deep copy of the previous state
    draw();
  }
}

function clearCanvas() {
  layers = [{}, {}, {}];
  stateHistory = [{}, {}, {}];
  draw();
}

tilesetImage.addEventListener("load", function () {
  preset();
  draw();
  tilesetSelect();
});

tilesetImage.src = imgSrc;
