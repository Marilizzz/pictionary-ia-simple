export default function Home({ setMode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#f0f2f5',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
          Pictionary IA
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
          Elige tu modo de juego
        </p>
        <div>
          <button
            onClick={() => setMode('timed')}
            style={{
              padding: '15px 40px',
              fontSize: '1.3rem',
              margin: '10px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Modo Timed (30 segundos)
          </button>
          <br />
          <button
            onClick={() => setMode('unlimited')}
            style={{
              padding: '15px 40px',
              fontSize: '1.3rem',
              margin: '10px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Modo Libre (sin tiempo)
          </button>
        </div>
      </div>
    </div>
  )
}