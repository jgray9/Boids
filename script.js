const BOIDS = [];

document.addEventListener("DOMContentLoaded", function (ev) {
    setInterval(updateBoids, dt * 1000);
    document.getElementById("boidbox").getContext("2d").lineWidth = LSIZE;
});

function addBoid(ev) {
    let x = ev.offsetX/4;
    let y = ev.offsetY/4;

    let b = new Boid(x, y);
    b.vel = new Vector(
        (Math.random() * 40) - 20,
        (Math.random() * 40) - 20
    );
    BOIDS.push(b);
}

function updateBoids() {
    canvas = document.getElementById("boidbox");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let kdtree = new KDTree();
    for (let b of BOIDS)
        kdtree.insert(b);

    for (let b of BOIDS) {
        // Collision Avoidance Force   sum of vectors from b's neighbors to b (scaled by distance)
        // Velocity Matching Force     vector from b's velocity to average velocity of neighbors
        // Flock Centering Force       vector from b to average position of neighbors
        let c_force = new Vector();
        let v_force = new Vector();
        let f_force = new Vector();
        let b_force = new Vector();

        let num_neighbors = 0;

        for (let nbr of kdtree.findNeighbors(b, NEIGHBOR_RADIUS)) {
            v_nb = b.pos.sub(nbr.pos);
            v_nb.length = NEIGHBOR_RADIUS - b.pos.distance(nbr.pos); // length of vector increases as boid gets closer
            c_force.iadd(v_nb);
            v_force.iadd(nbr.vel);
            f_force.iadd(nbr.pos);

            num_neighbors += 1;

            if(LVISIBLE) {
                ctx.beginPath();
                ctx.moveTo(b.pos.x, b.pos.y);
                ctx.lineTo(nbr.pos.x, nbr.pos.y);
                ctx.stroke();
            }
        }

        // v_force = μ(n.velocity) - b.velocity = Σ(n.velocity) / |N| - b.velocity
        // f_force = μ(n.position) - b.position = Σ(n.position) / |N| - b.position
        if (num_neighbors > 0) {
            v_force = v_force.div(num_neighbors).sub(b.vel);
            f_force = f_force.div(num_neighbors).sub(b.pos);
        }

        // if distance(border, b.position.x) < STEERING RADIUS:
        //     b_force = STEERING_RADIUS - distance
        if (b.pos.x < STEERING_RADIUS)
            b_force.x = STEERING_RADIUS - b.pos.x;
        else if (canvas.width - b.pos.x < STEERING_RADIUS)
            b_force.x = (canvas.width - b.pos.x) - STEERING_RADIUS;
        if(b.pos.y < STEERING_RADIUS)
            b_force.y = STEERING_RADIUS - b.pos.y;
        else if (canvas.height - b.pos.y < STEERING_RADIUS)
            b_force.y = (canvas.height - b.pos.y) - STEERING_RADIUS;

        // add forces to velocity
        b.vel.iadd( c_force.mul(COLLISION_FORCE).mul(dt) );
        b.vel.iadd( v_force.mul(VELOCITY_FORCE).mul(dt) );
        b.vel.iadd( f_force.mul(CENTERING_FORCE).mul(dt) );
        b.vel.iadd( b_force.mul(BORDER_FORCE).mul(dt) );
    }

    for (let b of BOIDS) {
        // prevent boids moving too slow
        if(b.vel.length < MIN_SPEED && b.vel.length > 0)
            b.vel = b.vel.div(b.vel.length).mul(MIN_SPEED);
        // update position
        b.pos.iadd(b.vel.mul(dt));

        ctx.fillRect(b.pos.x - BSIZE/2, b.pos.y - BSIZE/2, BSIZE, BSIZE);
    }
}