class Boid {
    constructor(x,y) {
        this.p = new Vector(x,y);
        this.v = new Vector();
    }

    add(b) {
        this.p.iadd(b.p);
        this.v.iadd(b.v);
    } 
}

class Vector {
    constructor(x=0,y=x) {
        this.x = x;
        this.y = y;
    }

    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    set length(i) {
        this.idiv(this.length);
        this.imul(i);
    }

    distance(otherVec) {
        return this.sub(otherVec).length;
    }

    add(otherVec) {
        return new Vector(
            this.x + (otherVec.x ?? otherVec),
            this.y + (otherVec.y ?? otherVec)
        );
    }

    sub(otherVec) {
        return new Vector(
            this.x - (otherVec.x ?? otherVec),
            this.y - (otherVec.y ?? otherVec)
        );
    }

    mul(otherVec) {
        return new Vector(
            this.x * (otherVec.x ?? otherVec),
            this.y * (otherVec.y ?? otherVec)
        );
    }

    div(otherVec) {
        return new Vector(
            this.x / (otherVec.x ?? otherVec),
            this.y / (otherVec.y ?? otherVec)
        );
    }

    iadd(otherVec) {
        this.x += otherVec.x ?? otherVec;
        this.y += otherVec.y ?? otherVec;
    }

    imul(otherVec) {
        this.x *= otherVec.x ?? otherVec;
        this.y *= otherVec.y ?? otherVec;
    }

    idiv(otherVec) {
        this.x /= otherVec.x ?? otherVec;
        this.y /= otherVec.y ?? otherVec;
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
    let boidbox = document.getElementById("boidbox");
    for(let i = 0; i < 2; i++) {
        let b = new Boid(0,0);
        b.p.x = Math.random() * boidbox.width;
        b.p.y = Math.random() * boidbox.height;
        b.v = new Vector(
            (Math.random() * 40) - 20,
            (Math.random() * 40) - 20
        )
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
            if(b.p.distance(n.p) > NEIGHBOR_RADIUS) continue;
            sumb.add(n);
            num_neighbors += 1;
        }

        /*
        Collision Avoidance Force   sum of vectors from b's neighbors to b
        Velocity Matching Force     vector from b's velocity to average velocity of neighbors
        Flock Centering Force       vector from b to average position of neighbors

        c_force = Σ(b.position - n.position) = |N|*b.position - Σ(n.position)
        v_force = μ(n.velocity) - b.velocity = Σ(n.velocity) / |N| - b.velocity
        f_force = μ(n.position) - b.position = Σ(n.position) / |N| - b.position
        */
        let c_force = new Vector();
        let v_force = new Vector();
        let f_force = new Vector();
        if (num_neighbors > 0) {
            c_force = b.p.sub(sumb.p).mul(num_neighbors);
            v_force = sumb.v.div(num_neighbors).sub(b.v);
            f_force = sumb.p.div(num_neighbors).sub(b.p);

            b.v.iadd( c_force.mul(COLLISION).mul(dt) );
            b.v.iadd( v_force.mul(VELOCITY).mul(dt) );
            b.v.iadd( f_force.mul(CENTERING).mul(dt) );
        }


        {
            let debugText = document.getElementById("debug");
            debugText.innerHTML += "BOID:<br>";
            debugText.innerHTML += `Position: ${Math.round(b.p.x)}, ${Math.round(b.p.y)}<br>`;
            debugText.innerHTML += `Velocity: ${Math.round(b.v.x)}, ${Math.round(b.v.y)}<br>`;
            debugText.innerHTML += `Collision: ${Math.round(c_force.x)}, ${Math.round(c_force.y)}<br>`;
            debugText.innerHTML += `Velocity: ${Math.round(v_force.x)}, ${Math.round(v_force.y)}<br>`;
            debugText.innerHTML += `Centering: ${Math.round(f_force.x)}, ${Math.round(f_force.y)}<br>`;
        }
    }

    for (let b of boids) {
        if (b.p.x < BSIZE*2)
            b.v.x += 1;
        if (b.p.x > canvas.width - BSIZE*2)
            b.v.x -= 1;
        if (b.p.y < BSIZE*2)
            b.v.y += 1;
        if (b.p.y > canvas.height - BSIZE*2)
            b.v.y -= 1;
        // prevent boids moving too slow
        if(b.v.length < MIN_SPEED)
            b.v = b.v.div(b.v.length).mul(MIN_SPEED);
        // update position
        b.p.iadd(b.v.mul(dt));

        ctx.fillRect(b.p.x - BSIZE/2, b.p.y - BSIZE/2, BSIZE, BSIZE);
    }
}