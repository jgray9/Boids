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

const boids = [];
const dt = 0.01; // timestep in seconds
const BSIZE = 5;
const NEIGHBOR_RADIUS = 50;

const COLLISION = 1;
const VELOCITY = 1;
const CENTERING = 1;

const MIN_SPEED = 20;

document.addEventListener("DOMContentLoaded", function (ev) {
    // randomize velocity of each void
    for(let i = 0; i < 2; i++) {
        let b = new Boid(0,0);
        b.p[0] = Math.random() * document.getElementById("boidbox").width;
        b.p[1] = Math.random() * document.getElementById("boidbox").height;
        b.v = b.v.map(_ => (Math.random() * 40) - 20);
        boids.push(b);
    }
    setInterval(update_boids, dt * 1000);
});

function update_boids() {
    canvas = document.getElementById("boidbox");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("debug").innerHTML = "";

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

        /*
        Collision Avoidance Force   sum of vectors from b's neighbors to b
        Velocity Matching Force     vector from b's velocity to average velocity of neighbors
        Flock Centering Force       vector from b to average position of neighbors

        c_force = Σ(b.position - n.position) = |N|*b.position - Σ(n.position)
        v_force = μ(n.velocity) - b.velocity = Σ(n.velocity) / |N| - b.velocity
        f_force = μ(n.position) - b.position = Σ(n.position) / |N| - b.position
        */
        let c_force = [0,0];
        let v_force = [0,0];
        let f_force = [0,0];

        for(let i = 0; i < 2; i++) {
            c_force[i] = num_neighbors * b.p[i] - sumb.p[i];
            v_force[i] = sumb.v[i] / num_neighbors - b.v[i];
            f_force[i] = sumb.p[i] / num_neighbors - b.p[i];
        }
        document.getElementById("debug").innerHTML += `BOID:<br>Position: ${b.p}<br>Velocity: ${b.v}<br>Collision: ${c_force}<br>Matching: ${v_force}<br>Centering: ${f_force}<br>`;

        b.v.forEach((_,i) => {
            b.v[i] += (
                COLLISION * c_force[i] +
                VELOCITY  * v_force[i] +
                CENTERING * f_force[i]
            ) * dt;
        });
    }

    for (let b of boids) {
        // prevent out of bounds
        let futurepos = b.p.map((_,i) => b.p[i] + b.v[i] * dt);
        if(futurepos[0] < 0 + BSIZE/2 || futurepos[0] > canvas.width - BSIZE/2)
            b.v[0] *= -1;
        if(futurepos[1] < 0 + BSIZE/2 || futurepos[1] > canvas.height - BSIZE/2)
            b.v[1] *= -1;
        // prevent boids moving too slow
        let len = Math.sqrt(b.v.reduce((acc, val) => acc + val ** 2, 0)); // length of velocity vector
        if(len < MIN_SPEED)
            b.v = b.v.map(val => (val / len) * MIN_SPEED);
        // update position
        b.p.forEach((_,i) => b.p[i] += b.v[i] * dt);

        ctx.fillRect(b.p[0] - BSIZE/2, b.p[1] - BSIZE/2, BSIZE, BSIZE);
    }
}