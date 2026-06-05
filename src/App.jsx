import Boidbox from './Boidbox'
import './App.css'

function App() {
  return (
    <>
      {/* <div>
        <p>Show Neighbors</p>
        <input id="neighborbox" type="checkbox" onclick="LVISIBLE = !LVISIBLE" />
      </div> */}
      <div>
        <Boidbox />
      </div>
      <p id="debug"></p>
    </>
  )
}

export default App
