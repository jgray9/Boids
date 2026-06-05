import { useRef } from 'react';
import Boidbox from './Boidbox'
import './App.css'

function App() {
  let showGuides = useRef(false); // when true, draw lines between boids within neighbor radius

  return (
    <>
      <div>
        <p>Show Neighbors</p>
        <input id='neighborbox' type='checkbox' onChange={e => showGuides.current = e.target.checked} />
      </div>
      <div>
        <Boidbox showGuides={showGuides} />
      </div>
      <p id="debug"></p>
    </>
  )
}

export default App
