const tilesetImage = document.getElementById("tileset-source");
var canvas = document.querySelector("#editor-canvas");
const tilesetContainer = document.querySelector(".tileset-container");
const tilesetSelection = document.querySelector(".tileset-container-selection");

const IMG_SOURCE = "./assets/demo_tileset_16x16.png";

const SIZE_OF_CROP = 16;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

var currentBrush;

const brushOptions = document.querySelectorAll(".brush-option");
brushOptions.forEach((option) => {
  option.addEventListener("change", () => {
    currentBrush = option.dataset.select;
    console.log(`Current brush: ${currentBrush}`);
  });
});

window.onload = function () {
  tilesetSelection.style.width = `${SIZE_OF_CROP}px`;
  tilesetSelection.style.height = `${SIZE_OF_CROP}px`;
};

const widthInput = document.querySelector(".inputWidth");
const heightInput = document.querySelector(".inputHeight");

function updateCanvasSize() {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);

  canvas.width = width;
  canvas.height = height;

  draw();
  // Add code to redraw the canvas content here
}

document.querySelectorAll(".inputWidth, .inputHeight").forEach((input) => {
  input.addEventListener("input", updateCanvasSize);
});

let selection = [0, 0];
let currentLayer = 0;
let isMouseDown = false;
const isLayerBlocked = [
  //Bottom
  false,
  // Middle
  false,
  // Top
  false,
];
let layers = [
  //Bottom layer
  {
    //Structure is "x-y": ["tileset_x", "tileset_y"]
    //EXAMPLE: "1-1": [3, 4],
  },
  //Middle layer
  {},
  //Top layer
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

function updateSelection() {
  tilesetSelection.style.left = selection[0] * SIZE_OF_CROP + "px";
  tilesetSelection.style.top = selection[1] * SIZE_OF_CROP + "px";
}

function getCoordinates(event) {
  const { x, y } = event.target.getBoundingClientRect();
  const selectionX = Math.floor(Math.max(event.clientX - x, 0) / SIZE_OF_CROP);
  const selectionY = Math.floor(Math.max(event.clientY - y, 0) / SIZE_OF_CROP);

  return [selectionX, selectionY];
}

function draw() {
  const ctx = getContext();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  layers.forEach((layer) => {
    Object.keys(layer).forEach((key) => {
      const [positionX, positionY] = key.split("-").map(Number);
      const [tilesheetX, tilesheetY] = layer[key];

      ctx.drawImage(
        tilesetImage,
        tilesheetX * SIZE_OF_CROP,
        tilesheetY * SIZE_OF_CROP,
        SIZE_OF_CROP,
        SIZE_OF_CROP,
        positionX * SIZE_OF_CROP,
        positionY * SIZE_OF_CROP,
        SIZE_OF_CROP,
        SIZE_OF_CROP
      );
    });
  });
}

function setMouseIsTrue() {
  isMouseDown = true;
}

function setMouseIsFalse() {
  isMouseDown = false;
}

// toggle brush tool in the future
function toggleTile(event) {
  if (isLayerBlocked[currentLayer]) {
    return;
  }

  const clicked = getCoordinates(event);
  const key = clicked[0] + "-" + clicked[1];
  const isArray = (likely) => Array.isArray(likely) && likely[0] !== undefined;

  if (event.altKey) {
    if (event.type === "mousedown") {
      applyCtrlZ(key, isArray);
    }

    return;
  }

  updateStateHistory(key, isArray);

  // eraser
  if (currentBrush == 2) {
    removeTile(key);
  } else if (currentBrush == 4) {
    getTile(key);
  } else {
    addTile(key);
  }

  // if (event.shiftKey) {
  //   removeTile(key);
  // } else if (event.ctrlKey) {
  //   getTile(key);
  // } else {
  //   addTile(key);
  // }

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

function applyCtrlZ(key, isArray) {
  const tileHistory = stateHistory[currentLayer][key];

  if (isArray(tileHistory)) {
    const lastSelected = stateHistory[currentLayer][key].pop();
    if (isArray(lastSelected)) {
      selection = lastSelected;
      updateSelection();
      addTile(key);
      draw();
    }
  }
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

function clearCanvas() {
  layers = [{}, {}, {}];
  stateHistory = [{}, {}, {}];
  draw();
}

function exportImage() {
  const data = canvas.toDataURL();

  const image = new Image();
  image.src = data;

  const w = window.open("");
  w.document.write(image.outerHTML);
}

const jsonImport = document.getElementById("importJSON");
jsonImport.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => {
    const json = reader.result;
    const uploadedGrid = JSON.parse(json);
    console.log(uploadedGrid);
    layers = uploadedGrid;
    draw();
  };
});

function exportJSON() {
  const json = JSON.stringify(layers);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tilemap.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

tilesetContainer.addEventListener("mousedown", (e) => {
  selection = getCoordinates(e);
  updateSelection();
});

canvas.addEventListener("mousedown", setMouseIsTrue);
canvas.addEventListener("mouseup", setMouseIsFalse);
canvas.addEventListener("mouseleave", setMouseIsFalse);
canvas.addEventListener("mousedown", toggleTile);
canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    toggleTile(e);
  }
});

tilesetImage.addEventListener("load", function () {
  preset();
  draw();
});

tilesetImage.src = IMG_SOURCE;
