import { useEffect, useRef } from 'react';
import Boidbox from './Boidbox'
import './App.css'

function App() {
  let showGuides = useRef(false); // when true, draw lines between boids within neighbor radius

  useEffect(() => {
    document.querySelector('.neighborbox').checked = false;
  }, []);

  return (
    <>
      <section>
        <div className='controls'>
          <p className='control'>Show Neighbors</p>
          <input className='control neighborbox' type='checkbox' onChange={e => showGuides.current = e.target.checked} />
        </div>
      </section>
      <section>
        <Boidbox showGuides={showGuides} />
      </section>
    </>
  )
}

export default App
