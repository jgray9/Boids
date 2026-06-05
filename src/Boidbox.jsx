import { useEffect, useRef } from 'react'
import Vector from './Vector'
import KDTree from './KDTree'
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
    let b = {
      'p': new Vector(x, y),
      'v': new Vector(Math.random() - 0.5, Math.random() - 0.5)
    };
    boids.current.push(b);
  }

  function updateBoids(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let kdtree = new KDTree(NEIGHBOR_RADIUS);

    //
    // UPDATE POSITION
    //
    for (let b of boids.current) {
      b.p = b.p.add(b.v);
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
      for (let nbr of kdtree.findNeighbors(b)) {
        let dist = Vector.Distance(b.p, nbr.p);

        // add vector from nbr -> b if nbr is close enough
        if (dist < COLLISION_RADIUS) {
          let v_nb = b.p.sub(nbr.p);
          v_nb = v_nb.withLength(COLLISION_RADIUS - dist); // length of vector increases as boid gets closer
          c_force = c_force.add(v_nb);
        }

        v_force = v_force.add(nbr.v);
        f_force = f_force.add(nbr.p);
        num_neighbors += 1;

        // TODO reimplement
        // if (LVISIBLE) {
        //   ctx.beginPath();
        //   ctx.moveTo(b.pos.x, b.pos.y);
        //   ctx.strokeStyle = dist < COLLISION_RADIUS ? 'red' : 'gray';
        //   ctx.lineTo(nbr.pos.x, nbr.pos.y);
        //   ctx.stroke();
        // }
      }

      // v_force = μ(n.velocity) - b.velocity = Σ(n.velocity) / |N| - b.velocity
      // f_force = μ(n.position) - b.position = Σ(n.position) / |N| - b.position
      if (num_neighbors > 0) {
        v_force = v_force.div(num_neighbors).sub(b.v);
        f_force = f_force.div(num_neighbors).sub(b.p);
      }

      // if distance(border.axis, b.position.axis) < STEERING RADIUS:
      //     b_force.axis = STEERING_RADIUS - distance
      if (b.p.x < NEIGHBOR_RADIUS)
        b_force.x = NEIGHBOR_RADIUS - b.p.x;
      else if (canvas.width - b.p.x < NEIGHBOR_RADIUS)
        b_force.x = (canvas.width - b.p.x) - NEIGHBOR_RADIUS;
      if (b.p.y < NEIGHBOR_RADIUS)
        b_force.y = NEIGHBOR_RADIUS - b.p.y;
      else if (canvas.height - b.p.y < NEIGHBOR_RADIUS)
        b_force.y = (canvas.height - b.p.y) - NEIGHBOR_RADIUS;

      // add forces to velocity
      b.v = b.v.add(c_force.mul(COLLISION_FORCE));
      b.v = b.v.add(v_force.mul(VELOCITY_FORCE));
      b.v = b.v.add(f_force.mul(CENTERING_FORCE));
      b.v = b.v.add(b_force.mul(BORDER_FORCE));

      // clamp boid speed between minimum and maximum
      if (b.v.getLengthSquared() <= MIN_SPEED ** 2 && b.v.getLengthSquared() > 0)
        b.v = b.v.withLength(MIN_SPEED);
      if (b.v.getLengthSquared() > MAX_SPEED ** 2)
        b.v = b.v.withLength(MAX_SPEED);
    }

    //
    // DRAW BOIDS
    //
    for (let b of boids.current) {
      // draw a triangle pointing in the direction of the boid velocity
      let v = b.v.getLength(); // length of velocity vector
      ctx.beginPath();
      // starting point = boid position offset by boid velocity
      ctx.moveTo(b.p.x + b.v.x * BSIZE, b.p.y + b.v.y * BSIZE);
      // rotate velocity vector by 90deg and normalize, then offset by position
      // [0 -1][ b.vel.x ] = [ -b.vel.y ]
      // [1  0][ b.vel.y ] = [  b.vel.x ]
      ctx.lineTo(b.p.x - b.v.y / v * BSIZE, b.p.y + b.v.x / v * BSIZE);
      // rotate velocity vector by 270deg and normalize, then offset by position
      // [ 0  1][ b.vel.x ] = [  b.vel.y ]
      // [-1  0][ b.vel.y ] = [ -b.vel.x ]
      ctx.lineTo(b.p.x + b.v.y / v * BSIZE, b.p.y - b.v.x / v * BSIZE);
      ctx.closePath();
      ctx.fill();
    }

    ctx.stroke();
  }

  let canvasRef = useRef(null);
  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    let timerID = setInterval(() => updateBoids(canvas, ctx), 1000 / FPS);
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