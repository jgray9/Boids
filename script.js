class Boid {
    constructor(x,y) {
        this.p = [x,y];
        this.v = [0,0];
    }

    distance(b) {
        let dx = this.p[0] - b.p[0];
        let dy = this.p[1] - b.p[1];
        return Math.sqrt(dx*dx+dy*dy);
    }

    add(b) {
        this.p[0] += b.p[0];
        this.p[1] += b.p[1];
        this.v[0] += b.v[0];
        this.v[1] += b.v[1];
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
        let c_force = b.p.map((_,i) => num_neighbors * b.p[i] - sumb.p[i]);
        let v_force = b.p.map((_,i) => sumb.v[i] / num_neighbors - b.v[i]);


        b.v.forEach((_,i) => b.v[i] += (c_force[i] + v_force[i]) * dt);
    }

    for (let b of boids) {
        // prevent out of bounds
        let futurepos = b.p.map((_,i) => b.p[i] + b.v[i] * dt);
        if(futurepos[0] < 0 || futurepos[0] > canvas.width - BSIZE)
            b.v[0] *= -1;
        if(futurepos[1] < 0 || futurepos[1] > canvas.height - BSIZE)
            b.v[1] *= -1;
        // update position
        b.p.forEach((_,i) => b.p[i] += b.v[i] * dt);

        ctx.fillRect(b.p[0], b.p[1], BSIZE, BSIZE);
    }
}