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

    add(b) {
        this.x += b.x;
        this.y += b.y;
        this.vx += b.vx;
        this.vy += b.vy;
    }
}

const boids = [
    new Boid(10,10),
    new Boid(15,13)
];
const dt = 0.01; // timestep in seconds
const BSIZE = 5;
const NEIGHBOR_RADIUS = 50;

document.addEventListener("DOMContentLoaded", function (ev) {
    setInterval(update_boids, dt * 1000);
});

function update_boids() {
    canvas = document.getElementById("boidbox");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let b of boids) {
        // not an actual boid
        // used to store sum of position and velocity of neighbors
        let sumb = new Boid(0,0);

        let num_neighbors = 0;
        for (let n of boids) {
            if(b == n) continue;
            if(b.distance(n) > NEIGHBOR_RADIUS) continue;
            sumb.add(n);
            num_neighbors += 1;
        }

        if(num_neighbors == 0)
            continue;

        // Collision Avoidance  Σ(b.position - n.position) = |N|*b.position - Σ(n.position)
        // Velocity Matching    μ(n.velocity) - b.velocity = Σ(n.velocity) / |N| - b.velocity
        // Flock Centering      μ(n.position) - b.position = Σ(n.position) / |N| - b.position
        let fx = num_neighbors * b.x - sumb.x;
        fx += sumb.vx / num_neighbors - b.vx;
        let fy = num_neighbors * b.y - sumb.y;
        fy += sumb.vy / num_neighbors - b.vy;


        b.vx += fx * dt;
        b.vy += fy * dt;
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