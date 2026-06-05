import { useEffect, useRef } from 'react'
import { Boid, Vector } from './classes'
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
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // boid logic
    boids.current.forEach(b => {
      ctx.rect(b.pos.x - 10, b.pos.y - 10, 20, 20);
    });
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