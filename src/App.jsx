import './App.css'

function App() {
  return (
    <>
      <div>
        <p>Show Neighbors</p>
        <input id="neighborbox" type="checkbox" onclick="LVISIBLE = !LVISIBLE" />
      </div>
      <div>
        <canvas id="boidbox" width="1200" height="600"></canvas>
      </div>
      <p id="debug"></p>
    </>
  )
}

export default App
