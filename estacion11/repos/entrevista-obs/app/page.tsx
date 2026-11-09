'use client';

import { useState, type FormEvent } from 'react';

interface Mensaje {
  rol: 'candidato' | 'agente';
  texto: string;
}

export default function Entrevista() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [estado, setEstado] = useState<string>('sin_iniciar');
  const [borrador, setBorrador] = useState('');
  const [token, setToken] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const terminada = estado === 'finalizada' || estado === 'rechazada';

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const texto = borrador.trim();
    if (!texto) return;
    setCargando(true);
    setError(null);
    setMensajes((actuales) => [...actuales, { rol: 'candidato', texto }]);
    setBorrador('');
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(conversacionId ? { mensaje: texto, conversacionId } : { mensaje: texto }),
      });
      const datos = await res.json();
      if (!res.ok) {
        setError(datos.error ?? 'El agente no pudo responder.');
        return;
      }
      setConversacionId(datos.conversacionId);
      setEstado(datos.estado);
      setMensajes((actuales) => [...actuales, { rol: 'agente', texto: datos.respuesta }]);
    } catch {
      setError('No se pudo contactar al agente.');
    } finally {
      setCargando(false);
    }
  }

  function reiniciar() {
    setMensajes([]);
    setConversacionId(null);
    setEstado('sin_iniciar');
    setError(null);
  }

  return (
    <main>
      <h1>EntreVista AI</h1>
      <p>Entrevista de screening para Agente de servicio al cliente bilingüe. Escribe &quot;Hola&quot; para empezar.</p>

      <section aria-label="Conversación">
        <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
          {mensajes.map((m, i) => (
            <li key={i} data-rol={m.rol} style={{ textAlign: m.rol === 'candidato' ? 'right' : 'left' }}>
              <strong>{m.rol === 'candidato' ? 'Tú' : 'EntreVista AI'}:</strong> {m.texto}
            </li>
          ))}
        </ol>
        {cargando && <p role="status">El agente está escribiendo…</p>}
        {error && <p role="alert">{error}</p>}
        {terminada && (
          <p role="status">
            Entrevista {estado === 'finalizada' ? 'terminada' : 'cancelada'}.{' '}
            <button type="button" onClick={reiniciar}>
              Nueva entrevista
            </button>
          </p>
        )}
      </section>

      <form onSubmit={enviar} style={{ display: 'grid', gap: 8 }}>
        <label>
          Tu respuesta
          <textarea value={borrador} onChange={(e) => setBorrador(e.target.value)} rows={3} style={{ width: '100%' }} maxLength={1000} disabled={terminada} />
        </label>
        <label>
          Token de acceso (si lo configuraste)
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} style={{ width: '100%' }} />
        </label>
        <button type="submit" disabled={cargando || terminada || borrador.trim() === ''}>
          Enviar
        </button>
      </form>
    </main>
  );
}
