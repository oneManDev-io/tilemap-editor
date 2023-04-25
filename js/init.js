var tilesetCanvas = document.getElementById("tileset-canvas");
var tilesetImage = document.getElementById("tileset-source");
// const tilesetContainer = document.querySelector(".tileset-container");
// const tilesetSelection = document.querySelector(".tileset-container-selection");
const selectionCanvas = document.querySelector(".selectionCanvas");
var canvas = document.querySelector("#editor-canvas");
const imgSrc = "./assets/demo_tileset.png";
// const imgSrc = "./assets/demo_tileset_16x16.png";
let pixelUnit = 32;

// tilemap selection size will depend on pixelUnit
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

window.onload = function () {
  // tilesetSelection.style.width = `${pixelUnit}px`;
  // tilesetSelection.style.height = `${pixelUnit}px`;
};

pixelSize = document.querySelector(".pixelSize");
