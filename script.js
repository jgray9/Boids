class Boid {
    constructor(x,y) {
        this.p = new Vector(x,y);
        this.v = new Vector();
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
const dt = 0.05; // timestep in seconds
const BSIZE = 2;
const NEIGHBOR_RADIUS = 20;
const STEERING_RADIUS = 20;

const COLLISION = 1;
const VELOCITY = 1;
const CENTERING = 1;
const BORDER = 10;

const MIN_SPEED = 20;

document.addEventListener("DOMContentLoaded", function (ev) {
    setInterval(update_boids, dt * 1000);
});

document.addEventListener("mousedown", function (ev) {
    canvas = document.getElementById("boidbox");

    let x = ev.x/4;
    let y = ev.y/4;

    let b = new Boid(
        Math.max(STEERING_RADIUS, Math.min(canvas.width - STEERING_RADIUS, x)),
        Math.max(STEERING_RADIUS, Math.min(canvas.height- STEERING_RADIUS, y))
    );
    b.v = new Vector(
        (Math.random() * 40) - 20,
        (Math.random() * 40) - 20
    );
    boids.push(b);
})

function update_boids() {
    canvas = document.getElementById("boidbox");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let b of boids) {
        // Collision Avoidance Force   sum of vectors from b's neighbors to b (scaled by distance)
        // Velocity Matching Force     vector from b's velocity to average velocity of neighbors
        // Flock Centering Force       vector from b to average position of neighbors
        let c_force = new Vector();
        let v_force = new Vector();
        let f_force = new Vector();
        let b_force = new Vector();

        let num_neighbors = 0;
        for (let n of boids) {
            if(b == n) continue;
            let distance = b.p.distance(n.p);
            if(distance > NEIGHBOR_RADIUS) continue;

            v_nb = b.p.sub(n.p);
            v_nb.length = NEIGHBOR_RADIUS - distance; // length of vector increases as boid gets closer
            c_force.iadd(v_nb);
            v_force.iadd(n.v);
            f_force.iadd(n.p);

            num_neighbors += 1;
        }

        // v_force = μ(n.velocity) - b.velocity = Σ(n.velocity) / |N| - b.velocity
        // f_force = μ(n.position) - b.position = Σ(n.position) / |N| - b.position
        if (num_neighbors > 0) {
            v_force = v_force.div(num_neighbors).sub(b.v);
            f_force = f_force.div(num_neighbors).sub(b.p);
        }

        // if distance(border, b.position.x) < STEERING RADIUS:
        //     b_force = STEERING_RADIUS - distance
        if (b.p.x < STEERING_RADIUS)
            b_force.x = STEERING_RADIUS - b.p.x;
        else if (canvas.width - b.p.x < STEERING_RADIUS)
            b_force.x = (canvas.width - b.p.x) - STEERING_RADIUS;
        if(b.p.y < STEERING_RADIUS)
            b_force.y = STEERING_RADIUS - b.p.y;
        else if (canvas.height - b.p.y < STEERING_RADIUS)
            b_force.y = (canvas.height - b.p.y) - STEERING_RADIUS;

        // add forces to velocity
        b.v.iadd( c_force.mul(COLLISION).mul(dt) );
        b.v.iadd( v_force.mul(VELOCITY).mul(dt) );
        b.v.iadd( f_force.mul(CENTERING).mul(dt) );
        b.v.iadd( b_force.mul(BORDER).mul(dt) );
    }

    for (let b of boids) {
        // prevent boids moving too slow
        if(b.v.length < MIN_SPEED && b.v.length > 0)
            b.v = b.v.div(b.v.length).mul(MIN_SPEED);
        // update position
        b.p.iadd(b.v.mul(dt));

        ctx.fillRect(b.p.x - BSIZE/2, b.p.y - BSIZE/2, BSIZE, BSIZE);
    }
}