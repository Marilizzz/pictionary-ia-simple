import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import words from '../words.json'

const REPLICATE_TOKEN = "r8_50s4y39Jq7foZ6BmbwVALai9DVe8dSx0BjegE"  // ← Cambia esto
const HF_TOKEN = "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"          // ← Cambia esto
export default function Game({ mode, reset }) {
  const [lines, setLines] = useState([])
  const [word] = useState(words[Math.floor(Math.random() * words.length)])
  const [timeLeft, setTimeLeft] = useState(30)
  const [result, setResult] = useState(null)
  const isDrawing = useRef(false)
  const stageRef = useRef()

  useEffect(() => {
    if (mode === 'timed' && timeLeft > 0 && !result) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(t)
    }
    if (timeLeft === 0) finishDrawing()
  }, [timeLeft, mode, result])

  const handleMouseDown = () => { isDrawing.current = true }
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return
    const point = e.target.getStage().getPointerPosition()
    let last = lines[lines.length - 1] || { points: [] }
    last.points = last.points.concat([point.x, point.y])
    setLines([...lines.slice(0, -1), last])
  }
  const handleMouseUp = () => { isDrawing.current = false }

  const startLine = (e) => {
    isDrawing.current = true
    const pos = e.target.getStage().getPointerPosition()
    setLines([...lines, { points: [pos.x, pos.y] }])
  }

  const finishDrawing = async () => {
    const uri = stageRef.current.toDataURL()
    setResult({ loading: true })

    if (mode === 'timed') {
      // Completar con Replicate
      const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: { Authorization: `Token ${REPLICATE_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          version: "a9267e9f39b8a2d66e0c5d27a8bb25f2ac5da3e99c8f96f69e9f0e5f94e3f2e9",
          input: { image: uri, prompt: word, mask: uri }
        })
      })
      let prediction = await res.json()
      while (prediction.status !== "succeeded" && prediction.status !== "failed") {
        await new Promise(r => setTimeout(r, 1000))
        const r = await fetch(prediction.urls.get, { headers: { Authorization: `Token ${REPLICATE_TOKEN}` }})
        prediction = await r.json()
      }
      setResult({ type: 'completed', user: uri, ai: prediction.output })
    } else {
      // Adivinar con Hugging Face
      const res = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
        method: "POST",
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
        body: uri.split(',')[1]
      })
      const data = await res.json()
      const guess = data[0]?.generated_text?.toLowerCase() || "No sé"
      setResult({ type: 'guessed', user: uri, guess, correct: guess.includes(word) })
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Dibuja: <strong>{word.toUpperCase()}</strong></h2>
      {mode === 'timed' && <h3>Tiempo: {timeLeft}s</h3>}

      {!result && (
        <>
          <Stage width={700} height={500} ref={stageRef}
            onMouseDown={startLine} onMousemove={handleMouseMove} onMouseUp={handleMouseUp}
            style={{ border: '3px solid #333', background: '#fff', margin: 'auto' }}>
            <Layer>
              {lines.map((line, i) => (
                <Line key={i} points={line.points} stroke="#000" strokeWidth={6} lineCap="round" />
              ))}
            </Layer>
          </Stage>
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setLines([])}>Limpiar</button>
            {mode === 'unlimited' && <button onClick={finishDrawing} style={{ background: '#e91e63', color: 'white' }}>Terminé</button>}
          </div>
        </>
      )}

      {result?.loading && <p>La IA está trabajando...</p>}
      {result?.type === 'completed' && (
        <div>
          <h3>¡La IA completó tu dibujo!</h3>
          <img src={result.user} alt="Tú" width={300} />
          <img src={result.ai} alt="IA" width={300} />
        </div>
      )}
      {result?.type === 'guessed' && (
        <div>
          <h3>La IA dice: "{result.guess}"</h3>
          <h2 style={{ color: result.correct ? 'green' : 'red' }}>
            {result.correct ? '¡Correcto!' : `Era "${word}"`}
          </h2>
          <img src={result.user} width={400} />
        </div>
      )}

      {result && <button onClick={reset}>Jugar de nuevo</button>}
    </div>
  )
}