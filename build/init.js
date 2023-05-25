"use strict";
var tilesetCanvas = document.getElementById("tileset-canvas");
var tilesetImage = document.getElementById("tileset-source");
var selectionCanvas = document.querySelector(".selectionCanvas");
var canvas = document.querySelector("#editor-canvas");
// let imgSrc = "./assets/demo_tileset.png";
// let imgSrc = "./assets/demo_tileset_16x16.png";
let imgSrc = "./assets/Tilemap_1.png";
let pixelUnit = 16;
let scale = pixelUnit === 16 ? 2 : 1;
// tilemap selection size will depend on pixelUnit
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
const gridWidth = canvasWidth / (pixelUnit * scale);
const gridHeight = canvasHeight / (pixelUnit * scale);
window.onload = function () {
    // tilesetCanvas.width = tilesetImage.width * scale * 2;
    // tilesetCanvas.height = tilesetImage.height * scale * 2;
    tilesetSelect();
};
