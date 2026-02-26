const BOIDS = [];

document.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('boidbox');
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = LSIZE;

    canvas.addEventListener('mousemove', event => {
        canvas.spawnX = event.offsetX;
        canvas.spawnY = event.offsetY;
    });
    canvas.addEventListener('mousedown', () => {
        addBoid(canvas.spawnX, canvas.spawnY);
        canvas.spawnIntervalID = setInterval(
            () => addBoid(canvas.spawnX, canvas.spawnY),
            1000 / BPS
        );
    });
    canvas.addEventListener('mouseup', () => {
        clearInterval(canvas.spawnIntervalID);
    });

    setInterval(updateBoids, 1000 / FPS);
    document.getElementById('neighborbox').checked = false;
});

function addBoid(x, y) {
    let b = new Boid(x, y);
    b.vel = new Vector(
        Math.random() - 0.5,
        Math.random() - 0.5
    );
    BOIDS.push(b);
}

function updateBoids() {
    let canvas = document.getElementById('boidbox');
    let ctx = canvas.getContext('2d');
    let kdtree = new KDTree();

    //
    // UPDATE POSITION & DRAW BOIDS
    //
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let b of BOIDS) {
        b.pos.iadd(b.vel);
        kdtree.insert(b);

        // draw a triangle pointing in the direction of the boid velocity
        let v = b.vel.getLength(); // length of velocity vector
        ctx.beginPath();
        // starting point = boid position offset by boid velocity
        ctx.moveTo(b.pos.x + b.vel.x*BSIZE, b.pos.y + b.vel.y*BSIZE);
        // rotate velocity vector by 90deg and normalize, then offset by position
        // [0 -1][ b.vel.x ] = [ -b.vel.y ]
        // [1  0][ b.vel.y ] = [  b.vel.x ]
        ctx.lineTo(b.pos.x - b.vel.y/v*BSIZE, b.pos.y + b.vel.x/v*BSIZE);
        // rotate velocity vector by 270deg and normalize, then offset by position
        // [ 0  1][ b.vel.x ] = [  b.vel.y ]
        // [-1  0][ b.vel.y ] = [ -b.vel.x ]
        ctx.lineTo(b.pos.x + b.vel.y/v*BSIZE, b.pos.y - b.vel.x/v*BSIZE);
        ctx.closePath();
        ctx.fill();

        if(LVISIBLE) {
            ctx.beginPath();
            ctx.arc(b.pos.x, b.pos.y, NEIGHBOR_RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
        }

    }

    //
    // UPDATE VELOCITY & DRAW NEIGHBOR LINES
    //
    for (let b of BOIDS) {
        // Collision Avoidance Force   sum of vectors from b's neighbors to b (scaled by distance)
        // Velocity Matching Force     vector from b's velocity to average velocity of neighbors
        // Flock Centering Force       vector from b to average position of neighbors
        // Border Avoidance Force      vectors from border edges to b
        let c_force = new Vector();
        let v_force = new Vector();
        let f_force = new Vector();
        let b_force = new Vector();

        let num_neighbors = 0;
        for (let nbr of kdtree.findNeighbors(b)) {
            let dist = Boid.Distance(b, nbr);
            if (dist < COLLISION_RADIUS) {
                v_nb = b.pos.sub(nbr.pos);
                v_nb.setLength( COLLISION_RADIUS - Boid.Distance(b, nbr) ); // length of vector increases as boid gets closer
                c_force.iadd(v_nb);
            }
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

        // if distance(border.axis, b.position.axis) < STEERING RADIUS:
        //     b_force.axis = STEERING_RADIUS - distance
        if (b.pos.x < NEIGHBOR_RADIUS)
            b_force.x = NEIGHBOR_RADIUS - b.pos.x;
        else if (canvas.width - b.pos.x < NEIGHBOR_RADIUS)
            b_force.x = (canvas.width - b.pos.x) - NEIGHBOR_RADIUS;
        if(b.pos.y < NEIGHBOR_RADIUS)
            b_force.y = NEIGHBOR_RADIUS - b.pos.y;
        else if (canvas.height - b.pos.y < NEIGHBOR_RADIUS)
            b_force.y = (canvas.height - b.pos.y) - NEIGHBOR_RADIUS;

        // add forces to velocity
        b.vel.iadd( c_force.mul(COLLISION_FORCE) );
        b.vel.iadd( v_force.mul(VELOCITY_FORCE) );
        b.vel.iadd( f_force.mul(CENTERING_FORCE) );
        b.vel.iadd( b_force.mul(BORDER_FORCE) );

        // clamp boid speed between minimum and maximum
        if(b.vel.getLengthSquared() <= MIN_SPEED**2 && b.vel.getLengthSquared() > 0)
            b.vel.setLength(MIN_SPEED);
        if(b.vel.getLengthSquared() > MAX_SPEED**2)
            b.vel.setLength(MAX_SPEED);
    }
}