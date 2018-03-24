"use strict";


/**
 * Constructor for the game
 *
 * @param data object 
 *   required keys: canvas, level
 *   optional keys: gridSize, height, width, ctx
 */
const Game = function (data) {
  this.gridSize = data.gridSize || 20;
  this.height = data.height || 400;
  this.width = data.width || 400;
  this.mapWidth = this.width * this.gridSize;
  this.mapHeight = this.height * this.gridSize;
  this.centerX = this.width / 2;
  this.centerY = this.height / 2;
  this.canvas = data.canvas;
  this.ctx = data.ctx || data.canvas.getContext("2d");
  this.ctx.lineWidth = Math.max(1, this.width / 300);
  this.loadLevel(data.level, this.gridSize);
  this.level = data.level;
  this.kbd = { u: false, d: false, l: false, r: false };

  document.addEventListener("keydown", e => {
    if (e.keyCode === 37) {
      this.kbd.l = true;
      e.preventDefault();
    }
    else if (e.keyCode === 38) {
      this.kbd.u = true;
      e.preventDefault();
    }
    else if (e.keyCode === 39) {
      this.kbd.r = true;
      e.preventDefault();
    }
    else if (e.keyCode === 40) {
      this.kbd.d = true;
      e.preventDefault();
    }
  });
  document.addEventListener("keyup", e => {
    if (e.keyCode === 37) {
      this.kbd.l = false;
      e.preventDefault();
    }
    else if (e.keyCode === 38) {
      this.kbd.u = false;
      e.preventDefault();
    }
    else if (e.keyCode === 39) {
      this.kbd.r = false;
      e.preventDefault();
    }
    else if (e.keyCode === 40) {
      this.kbd.d = false;
      e.preventDefault();
    }
  });
}; // end Game

/**
 * Loads a level from a 2d array of level data
 *   # wall
 *   @ player start location
 *
 * Sets three instance variables: polygon, player, segments
 *
 * @param level 2d array
 * @param gridSize size of the grid
 */
Game.prototype.loadLevel = function (level, gridSize) {
  const playerLocation = {};
  this.polygons = [];
  
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      const x = j * gridSize;
      const y = i * gridSize;

      if (level[i][j] === "#") {
        this.polygons.push([
          [x, y], [x + gridSize, y], 
          [x + gridSize, y + gridSize], 
          [x, y + gridSize]
        ]);
      }
      else if (level[i][j] === "@") {
        playerLocation.x = x;
        playerLocation.y = y;
      }
    }
  }

  this.segments = VisibilityPolygon.breakIntersections(
    VisibilityPolygon.convertToSegments(this.polygons)
  );

  this.player = new Player({ 
    x: playerLocation.x, y: playerLocation.y, 
    size: this.gridSize / 2, speed: this.gridSize / 500
  });
}; // end loadLevel

/**
 * Renders the current game state to canvas
 *
 * @param ctx canvas context
 */
Game.prototype.render = function (ctx) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Find viewport
  const viewportX = -this.player.position[0] + this.centerX;
  const viewportY = -this.player.position[1] + this.centerY;

  // Visibility polygon
  const visibility = VisibilityPolygon.computeViewport(
    this.player.position, this.segments, 
    [
      this.player.position[0] - this.width, 
      this.player.position[1] - this.height
    ], 
    [
      this.player.position[0] + this.width, 
      this.player.position[1] + this.height
    ],
  );
  
  ctx.fillStyle = "#444";
  ctx.moveTo(visibility[0][0] + viewportX,visibility[0][1] + viewportY);	
  
  for (var i = 1; i < visibility.length; i++){
  	ctx.lineTo(visibility[i][0] + viewportX, visibility[i][1] + viewportY);		
  }
  //ctx.moveTo(visibility[0][0] + viewportX,visibility[0][1] + viewportY); // ctx.closePath();
  ctx.fill();
  
  // Polygons
  ctx.fillStyle = "#111";
  ctx.strokeStyle = "#000";
  
  for (let i = 0; i < this.polygons.length; i++) { // TODO cull to viewport
    const e = this.polygons[i];

    for (let i = 0; i < e.length; i++) {
      if (VisibilityPolygon.inPolygon([e[i][0], e[i][1]], visibility)) {
        ctx.beginPath();
        //ctx.moveTo(e[0][0], e[0][1]);
        e.forEach(e => 
          ctx.lineTo(e[0] + viewportX, e[1] + viewportY)
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
    }
  }
  
  // Player
  ctx.save();
  ctx.fillStyle = "#357";
  ctx.strokeStyle = "#000";
  ctx.translate(
    this.player.position[0] + viewportX, 
    this.player.position[1] + viewportY
  );
  ctx.rotate(rad(this.player.angle));
  ctx.fillRect(
    -this.player.halfSize, -this.player.halfSize, 
    this.player.size, this.player.size
  );
  ctx.strokeRect(
    -this.player.halfSize, -this.player.halfSize, 
    this.player.size, this.player.size
  );
  ctx.beginPath();
  ctx.moveTo(this.player.quarterSize, 0);
  ctx.lineTo(this.player.halfSize + this.player.quarterSize, 0);
  ctx.stroke();
  ctx.restore();
}; // end render

/**
 * Runs the main game loop
 */
Game.prototype.update = function () {
  const my = this;

  if (my.kbd.u) { my.player.accelerate(); }
  if (my.kbd.l) { my.player.rotateLeft(); }
  if (my.kbd.r) { my.player.rotateRight(); }

  my.player.update(my.level, my.gridSize);
  my.render(my.ctx);
  requestAnimationFrame(e => my.update());
}; // end update

/**
 * Starts the main game loop
 */
Game.prototype.start = function () { this.update(); };
