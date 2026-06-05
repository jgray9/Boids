import { useEffect, useRef } from 'react'
import { Boid, KDTree, Vector } from './classes'
import './Boidbox.css'

function Boidbox() {
  const FPS = 30;                 // updates per second
  const BPS = 10;                 // number of boids spawned per second when mouse is down
  const BSIZE = 5;                // size of boids
  const LSIZE = 0.5;              // size of neighbor lines
  const COLLISION_RADIUS = 20;    // max distance between boids for collision avoidance
  const NEIGHBOR_RADIUS = 50;     // max distance between boids for velocity matching and centering

  const COLLISION_FORCE = 0.05;   // modifier for collision avoidance force
  const VELOCITY_FORCE = 0.05;    // modifier for velocity matching force
  const CENTERING_FORCE = 0.001;  // modifier for flock centering force
  const BORDER_FORCE = 0.02;      // modifier for border avoidance force

  let LVISIBLE = false;               // when true, draw lines between boids within neighbor radius

  const MAX_SPEED = 10;           // maximum speed for any boid
  const MIN_SPEED = 2;            // minimum speed for any boid

  let boids = useRef([]);

  function addBoid(x, y) {
    let b = new Boid(x, y);
    b.vel = new Vector(
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    boids.current.push(b);
  }

  function updateBoids(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //
    // UPDATE POSITION
    //
    let kdtree = new KDTree();
    for (let b of boids.current) {
      b.pos.iadd(b.vel);
      kdtree.insert(b);
    }

    //
    // UPDATE VELOCITY & DRAW NEIGHBOR LINES
    //
    for (let b of boids.current) {
      // Collision Avoidance Force   sum of vectors from b's neighbors to b (scaled by distance)
      // Velocity Matching Force     vector from b's velocity to average velocity of neighbors
      // Flock Centering Force       vector from b to average position of neighbors
      // Border Avoidance Force      vectors from border edges to b
      let c_force = new Vector();
      let v_force = new Vector();
      let f_force = new Vector();
      let b_force = new Vector();

      let num_neighbors = 0;
      for (let nbr of kdtree.findNeighbors(b, NEIGHBOR_RADIUS)) {
        let dist = Boid.Distance(b, nbr);
        if (dist < COLLISION_RADIUS) {
          v_nb = b.pos.sub(nbr.pos);
          v_nb.setLength(COLLISION_RADIUS - dist); // length of vector increases as boid gets closer
          c_force.iadd(v_nb);
        }
        v_force.iadd(nbr.vel);
        f_force.iadd(nbr.pos);

        num_neighbors += 1;

        if (LVISIBLE) {
          ctx.beginPath();
          ctx.moveTo(b.pos.x, b.pos.y);
          ctx.strokeStyle = dist < COLLISION_RADIUS ? 'red' : 'gray';
          ctx.lineTo(nbr.pos.x, nbr.pos.y);
          ctx.stroke();
        }
      }

      // v_force = μ(n.velocity) - b.velocity = Σ(n.velocity) / |N| - b.velocity
      // f_force = μ(n.position) - b.position = Σ(n.position) / |N| - b.position
      if (num_neighbors > 0) {
        v_force.idiv(num_neighbors).isub(b.vel);
        f_force.idiv(num_neighbors).isub(b.pos);
      }

      // if distance(border.axis, b.position.axis) < STEERING RADIUS:
      //     b_force.axis = STEERING_RADIUS - distance
      if (b.pos.x < NEIGHBOR_RADIUS)
        b_force.x = NEIGHBOR_RADIUS - b.pos.x;
      else if (canvas.width - b.pos.x < NEIGHBOR_RADIUS)
        b_force.x = (canvas.width - b.pos.x) - NEIGHBOR_RADIUS;
      if (b.pos.y < NEIGHBOR_RADIUS)
        b_force.y = NEIGHBOR_RADIUS - b.pos.y;
      else if (canvas.height - b.pos.y < NEIGHBOR_RADIUS)
        b_force.y = (canvas.height - b.pos.y) - NEIGHBOR_RADIUS;

      // add forces to velocity
      b.vel.iadd(c_force.mul(COLLISION_FORCE));
      b.vel.iadd(v_force.mul(VELOCITY_FORCE));
      b.vel.iadd(f_force.mul(CENTERING_FORCE));
      b.vel.iadd(b_force.mul(BORDER_FORCE));

      // clamp boid speed between minimum and maximum
      if (b.vel.getLengthSquared() <= MIN_SPEED ** 2 && b.vel.getLengthSquared() > 0)
        b.vel.setLength(MIN_SPEED);
      if (b.vel.getLengthSquared() > MAX_SPEED ** 2)
        b.vel.setLength(MAX_SPEED);
    }

    //
    // DRAW BOIDS
    //
    for (let b of boids.current) {
      // draw a triangle pointing in the direction of the boid velocity
      let v = b.vel.getLength(); // length of velocity vector
      ctx.beginPath();
      // starting point = boid position offset by boid velocity
      ctx.moveTo(b.pos.x + b.vel.x * BSIZE, b.pos.y + b.vel.y * BSIZE);
      // rotate velocity vector by 90deg and normalize, then offset by position
      // [0 -1][ b.vel.x ] = [ -b.vel.y ]
      // [1  0][ b.vel.y ] = [  b.vel.x ]
      ctx.lineTo(b.pos.x - b.vel.y / v * BSIZE, b.pos.y + b.vel.x / v * BSIZE);
      // rotate velocity vector by 270deg and normalize, then offset by position
      // [ 0  1][ b.vel.x ] = [  b.vel.y ]
      // [-1  0][ b.vel.y ] = [ -b.vel.x ]
      ctx.lineTo(b.pos.x + b.vel.y / v * BSIZE, b.pos.y - b.vel.x / v * BSIZE);
      ctx.closePath();
      ctx.fill();
    }

    ctx.stroke();
  }

  let canvasRef = useRef(null);
  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    let timerID = setInterval(() => updateBoids(canvas, ctx), 1000 / 60);
    return () => clearTimeout(timerID);
  }, []);

  return <canvas
    id='boidbox'
    ref={canvasRef}
    width={1200}
    height={600}
    onMouseDown={e => addBoid(e.clientX, e.clientY)}
  />
}

export default Boidbox