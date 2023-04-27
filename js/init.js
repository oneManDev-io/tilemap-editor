var tilesetCanvas = document.getElementById("tileset-canvas");
var tilesetImage = document.getElementById("tileset-source");
var selectionCanvas = document.querySelector(".selectionCanvas");
var canvas = document.querySelector("#editor-canvas");
// const imgSrc = "./assets/demo_tileset.png";
// const imgSrc = "./assets/demo_tileset_16x16.png";
const imgSrc = "./assets/Tilemap_1.png";
let pixelUnit = 16;
let scale = pixelUnit === 16 ? 2 : 1;

// tilemap selection size will depend on pixelUnit
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

window.onload = function () {
  // tilesetCanvas.width = tilesetImage.width * scale * 2;
  // tilesetCanvas.height = tilesetImage.height * scale * 2;
  tilesetSelect();
};
