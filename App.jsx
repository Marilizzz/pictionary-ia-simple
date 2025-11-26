import { useState } from 'react'
import Home from './components/Home.jsx'
import Game from './components/Game.jsx'

function App() {
  const [mode, setMode] = useState(null) // null | "timed" | "unlimited"

  if (mode === null) {
    return <Home setMode={setMode} />
  }

  return <Game mode={mode} reset={() => setMode(null)} />
}

export default App