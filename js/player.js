"use strict";


/**
 * Constructor for a player
 *
 * @param data object 
 *   required keys: none
 *   optional keys: size, position, speed, rotationSpeed, friction
 */
const Player = function (data) {
  this.size = data.size || 20;
  this.halfSize = this.size / 2;
  this.quarterSize = this.size / 4;
  this.position = [
    (data.x + this.size / 2 + 10) || 20, 
    (data.y + this.size / 2 + 10) || 20
  ];
  this.speed = data.speed || 0.03;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  this.angle = 0;
  this.rotationSpeed = data.rotationSpeed || 4;
  this.friction = data.friction || 0.85;
}; // end Player

/**
 * Accelerates the player forward in its current direction
 */
Player.prototype.accelerate = function () {
  this.ax += Math.cos(rad(this.angle)) * this.speed;
  this.ay += Math.sin(rad(this.angle)) * this.speed;
}; // end accelerate

/**
 * Updates the position of the player
 *
 * @param level a 2d collision map
 * @param gridSize the size of each grid element
 */
Player.prototype.update = function (level, gridSize) {
  this.vx += this.ax;
  this.vy += this.ay;
  this.ax *= this.friction;
  this.ay *= this.friction;
  this.vx *= this.friction;
  this.vy *= this.friction;

  // Testing collision on each axis enables wall sliding
  this.position[0] += this.vx;

  if (this.collides(level, gridSize)) {
    this.position[0] -= this.vx;
    this.ax = 0;
    this.vx = 0;
  }

  this.position[1] += this.vy;

  if (this.collides(level, gridSize)) {
    this.position[1] -= this.vy;
    this.ay = 0;
    this.vy = 0;
  }
}; // end update

/**
 * Checks collision with objects in a level
 *
 * @param level a 2d collision map
 * @param gridSize the size of each grid element
 */
Player.prototype.collides = function (level, gridSize) {
  const x = this.position[0] / gridSize;
  const y = this.position[1] / gridSize;
  const step = 0.35; // TODO parametize
  const n = y - step | 0;
  const s = y + step | 0;
  const e = x + step | 0;
  const w = x - step | 0;
  return level[s] && level[s][e] === "#" ||
         level[n] && level[n][e] === "#" ||
         level[n] && level[n][w] === "#" ||
         level[s] && level[s][w] === "#";
}; // end collides

/**
 * Rotates the player left
 */
Player.prototype.rotateLeft = function () {
  this.angle -= this.rotationSpeed;
}; // end rotateLeft

/**
 * Rotates the player right 
 */
Player.prototype.rotateRight = function () {
  this.angle += this.rotationSpeed;
}; // end rotateRight
