"use strict";


const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = canvas.height = 400;
const gridSize = 30;
const mapGenerator = new MapGenerator();
const level = mapGenerator.generate();
level[1][1] = "@";

const game = new Game({
  gridSize: gridSize,
  canvas: canvas,
  level: level
});

game.start();
