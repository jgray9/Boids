import { useEffect, useRef } from 'react'
import './Boidbox.css'

function Boidbox() {
  function updateBoids(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // boid logic
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