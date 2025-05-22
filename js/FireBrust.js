// Import pitch and loudness detection functions
import { getPitch, getLoudness } from "./core.js";

// Setup canvas and context for drawing
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Store current color and loudness
let rgb = null; 
let loudness = null; 

// Particle array for firework visuals
let particles = [];

// Particle class handles movement and drawing of each particle
class Particles {
  constructor(x, y, dx, dy, size, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;
    this.opacity = 1;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= 0.015; // Gradually fade out
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Create an explosion based on loudness and pitch
function createExplosion(loudness) {
    let numParticles = Math.min(100, Math.floor(loudness / 2)); // Limit max particles

    // Random starting point
    let x = Math.random() * window.innerWidth * 0.3;
    let y = Math.random() * window.innerHeight;

    // Adjust x based on pitch
    let p = getPitch().pitch;
    if (p < 130) {
      x += 0;
    }
    else if (p < 400) {
      x += window.innerWidth * 0.3;
    }
    else {
      x += window.innerWidth * 0.6;      
    }

    // Create particles with color inverse of pitch color
    for (let i = numParticles * 0.5; i < numParticles; i++) {
        let size = Math.random() * loudness * 4;
        let dx = (Math.random() - 0.5) * 5;
        let dy = (Math.random() - 0.5) * 5;
        let color = "rgb(" + (250 - rgb[0]) + ", " + (250 - rgb[1]) + ", " + (250 - rgb[2]) + ")";
        let firework = new Particles(x, y, dx, dy, size, color);
        particles.push(firework);
    }
}

let lastTime = 0; 

// Draw and update all particles on screen
function animate() {
    rgb = getPitch().color;
    loudness = getLoudness();

    // Background color reflects pitch color
    ctx.fillStyle = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw each particle
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    // Remove particles that are too faded
    if (Date.now() - lastTime > 10) {
      particles = particles.filter((particle) => particle.opacity > 0.10);
      lastTime = Date.now(); 
    }
}

// Main loop that triggers fireworks and runs animation
export function loopFireWork() {
    rgb = getPitch().color;
    loudness = getLoudness();

    // Create explosion if loudness is above threshold
    if (loudness > 15) {
      createExplosion(loudness);
    }

    animate();

    // Continue loop if firework mode is active
    if (window.activemodule == "firework") {
      window.animationFrameId = requestAnimationFrame(loopFireWork);
    }
}