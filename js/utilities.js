"use strict";


const tau = Math.PI * 2;
const clamp = (n, lo, hi) => n < lo ? lo : n > hi ? hi : n;
const rad = d => d * Math.PI / 180;
const deg = r => r * 180 / Math.PI;
