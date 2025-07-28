class Boid {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }
}

const canvas = document.getElementById("boidbox");
const ctx = canvas.getContext("2d");
const boids = [];

function update_boids() {
    ctx.clearRect(0, 0, 1200, 600);
    for (let b in boids) {
        // physics here

        ctx.fillRect(b.x, b.y, 20, 20);
    }
}