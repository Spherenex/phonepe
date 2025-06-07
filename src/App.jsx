import { useState } from 'react'
import PohonePeReplica from './components/PhonePeReplica'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PohonePeReplica />
    </>
  )
}

export default App
