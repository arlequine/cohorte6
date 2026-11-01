'use client';

import { useState, type FormEvent } from 'react';

export default function Inicio() {
  const [mensaje, setMensaje] = useState('');
  const [token, setToken] = useState('');
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setCargando(true);
    setRespuesta(null);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ mensaje }),
      });
      const datos = await res.json();
      setRespuesta(res.ok ? datos.respuesta : `Error: ${datos.error}`);
    } catch {
      setRespuesta('Error: no se pudo contactar al agente.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main>
      <h1>Walking skeleton</h1>
      <p>Una página, un agente y CI, desplegados desde la semana 3.</p>
      <form onSubmit={enviar} style={{ display: 'grid', gap: 8 }}>
        <label>
          Mensaje
          <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={3} style={{ width: '100%' }} maxLength={1000} />
        </label>
        <label>
          Token de acceso (si lo configuraste)
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} style={{ width: '100%' }} />
        </label>
        <button type="submit" disabled={cargando || mensaje.trim() === ''}>
          {cargando ? 'Pensando…' : 'Enviar'}
        </button>
      </form>
      {respuesta && <p aria-live="polite">{respuesta}</p>}
    </main>
  );
}
