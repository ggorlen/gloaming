"use strict";


const clamp = (n, lo, hi) => n < lo ? lo : n > hi ? hi : n;
const deg = r => r * 180 / Math.PI;
const rad = d => d * Math.PI / 180;
const rndInt = (lo, hi) => Math.random() * (hi - lo) + lo | 0;
const tau = Math.PI * 2;
