import { useEffect, useRef } from 'react'
import './Boidbox.css'

function Boidbox() {
  let boids = useRef([
    {
      'x': 10,
      'y': 10
    },
    {
      'x': 20,
      'y': 20
    }
  ]);

  function updateBoids(canvas, ctx) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // boid logic
    boids.current.forEach(b => {
      ctx.rect(b.x - 10, b.y - 10, 20, 20);
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

  return <canvas id='boidbox' ref={canvasRef} width={1200} height={600} />
}

export default Boidbox