"use strict";


/**
 * MapGenerator constructor
 *
 * @param width integer width of grid
 * @param height integer height of grid
 */
const MapGenerator = function () {};

MapGenerator.prototype.generate = function (width, height, limit) {
  const grid = this.prepare(width || 20, height || 20);
  this.makeRooms(grid, limit || 1);
  return grid;
};

MapGenerator.prototype.prepare = function (width, height) {
  const grid = [[]];

  for (let i = 0; i < width; i++) {
    grid[0].push("#");
  }
  
  for (let i = 1; i < height - 1; i++) {
    grid.push([]);
    
    grid[i].push("#");
    
    for (let j = 2; j < width; j++) {
      grid[i].push(" ");
    }
    
    grid[i].push("#");
  }
  
  grid.push([]);
  
  for (let i = 0; i < width; i++) {
    grid[grid.length-1].push("#");
  }

  return grid;
};

MapGenerator.prototype.makeRooms = function (grid, limit) {
  const h = grid.length;
  const w = grid[0].length;
  this.divide(grid, limit, 1, 1, h - 1, w - 1); 
};

MapGenerator.prototype.divide = function (grid, limit, rowMin, colMin, rowMax, colMax) {
  const rowDiff = rowMax - rowMin;
  const colDiff = colMax - colMin;

  if (rowDiff > limit * 2 && colDiff > limit * 2) {
    if (rowDiff > colDiff) {
      this.divideHorizontally(grid, limit, rowMin, colMin, rowMax, colMax);
    }
    else {
      this.divideVertically(grid, limit, rowMin, colMin, rowMax, colMax);
    }
  }
};

MapGenerator.prototype.divideHorizontally = function (grid, limit, rowMin, colMin, rowMax, colMax) {
  let wallRow, gap;
  let tries = 10;
  
  do {
    if (!tries--) { return; }

    wallRow = rndInt(rowMin + limit, rowMax - limit);
    gap = rndInt(colMin, colMax);
  } while ((grid[wallRow][colMin-1] && grid[wallRow][colMin-1] === " ") ||
           (grid[wallRow][colMax] && grid[wallRow][colMax] === " "));

  for (let i = colMin; i < colMax; i++) {
    if (i !== gap) {
      grid[wallRow][i] = "#";
    }
  }
  
  this.divide(grid, limit, rowMin, colMin, wallRow, colMax); 
  this.divide(grid, limit, wallRow + 1, colMin, rowMax, colMax); 
};

MapGenerator.prototype.divideVertically = function (grid, limit, rowMin, colMin, rowMax, colMax) {
  let wallCol, gap;
  let tries = 10;
  
  do {
    if (!tries--) { return; }

    wallCol = rndInt(colMin + limit, colMax - limit);
    gap = rndInt(rowMin, rowMax);
    } while ((grid[rowMin-1] && grid[rowMin-1][wallCol] === " ") || 
             (grid[rowMax] && grid[rowMax][wallCol] === " "));
  
  for (let i = rowMin; i < rowMax; i++) {
    if (i !== gap) {
      grid[i][wallCol] = "#";
    }
  }
  
  this.divide(grid, limit, rowMin, colMin, rowMax, wallCol);
  this.divide(grid, limit, rowMin, wallCol + 1, rowMax, colMax);
};

MapGenerator.prototype.printable = function (g) {
  return g.reduce((a, e) => a + e.join(" ") + "\n", "");
};
