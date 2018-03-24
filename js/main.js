"use strict";


const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = canvas.height = 400;
const gridSize = 30;
const level = [
  "####################",
  "#@   #    #   #  # #",
  "#  #      #   #  # #",
  "#  #  #####   #  # #",
  "#  #          #    #",
  "#  #      ### #  # #",
  "#  ########   #  # #",
  "#   #    #    #  # #",
  "#   #    #  ###### #",
  "#  ##    ##        #",
  "#         # ###    #",
  "#   #     #   # ####",
  "##### #####   # #  #",
  "#   #     #   # #  #",
  "# ######  #   #    #",
  "#      #  ##### ####",
  "#  ##  #  #        #",
  "#   #     #  #### ##",
  "#   #  #     #     #",
  "####################",
];

const game = new Game({
  gridSize: gridSize,
  canvas: canvas,
  level: level,
});

game.start();
