class Boid {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }

    distance(b) {
        let dx = this.x - b.x;
        let dy = this.y - b.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
}

const boids = [
    new Boid(10,10),
    new Boid(15,13)
];
const dt = 0.01; // timestep in seconds
const BSIZE = 5;

document.addEventListener("DOMContentLoaded", function (ev) {
    setInterval(update_boids, dt * 1000);
});

function update_boids() {
    canvas = document.getElementById("boidbox");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1200, 600);
    for (let b of boids) {
        for (let n of boids) {
            if(b == n) continue;
            if(b.distance(n) > 10) continue;
            b.vx += (b.x - n.x) * dt;
            b.vy += (b.y - n.y) * dt;
        }
    }

    for (let b of boids) {
        if(b.x + b.vx * dt < 0 || b.x + b.vx * dt > canvas.width - BSIZE)
            b.vx *= -1;
        if(b.y + b.vy * dt < 0 || b.y + b.vy * dt > canvas.height - BSIZE)
            b.vy *= -1;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        ctx.fillRect(b.x, b.y, BSIZE, BSIZE);
    }
}