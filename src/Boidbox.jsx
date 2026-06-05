import { useEffect, useRef } from 'react'
import './Boidbox.css'

function Boixbox() {
  let canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  }, []);

  return <canvas id='boidbox' ref={canvasRef} width={1200} height={600} />
}

export default Boidbox