var tilesetImage = document.getElementById("tileset-source");
var canvas = document.querySelector("#editor-canvas");
const tilesetContainer = document.querySelector(".tileset-container");
const tilesetSelection = document.querySelector(".tileset-container-selection");
const tilesetCanvas = document.getElementById("tileset-canvas");
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

  // Disable anti-aliasing
  ctx.strokeStyle = "black";

  for (let x = 0; x <= tilesetCanvas.width; x += pixelUnit * scale) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, tilesetCanvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= tilesetCanvas.height; y += pixelUnit * scale) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(tilesetCanvas.width, y + 0.5);
    ctx.stroke();
  }

  // Add click event listener to tilesetCanvas
  tilesetCanvas.addEventListener("click", function (event) {
    // Calculate the clicked tile position
    const rect = tilesetCanvas.getBoundingClientRect();
    const x =
      Math.floor((event.clientX - rect.left) / (pixelUnit * scale)) *
      pixelUnit *
      scale;
    const y =
      Math.floor((event.clientY - rect.top) / (pixelUnit * scale)) *
      pixelUnit *
      scale;

    // Draw a cyan colored stroke around the clicked tile
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      x + 0.5,
      y + 0.5,
      pixelUnit * scale - 1,
      pixelUnit * scale - 1
    );

    // Reset the stroke style and width after a short delay
    setTimeout(function () {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        x + 0.5,
        y + 0.5,
        pixelUnit * scale - 1,
        pixelUnit * scale - 1
      );
    }, 500);
  });
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