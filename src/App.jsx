import { useEffect, useRef } from 'react';
import Boidbox from './Boidbox'
import './App.css'

function App() {
  let showGuides = useRef(false); // when true, draw lines between boids within neighbor radius

  useEffect(() => {
    document.querySelector('neighborbox').checked = false;
  }, []);

  return (
    <>
      <section id='controls'>
        <p class='control'>Show Neighbors</p>
        <input class='control neighborbox' type='checkbox' onChange={e => showGuides.current = e.target.checked} />
      </section>
      <section>
        <Boidbox showGuides={showGuides} />
      </section>
    </>
  )
}

export default App
