// Prueba de carga de EntreVista AI con k6 (https://grafana.com/docs/k6/latest/).
//
// Cada iteración es una entrevista completa: abrir, dar consentimiento y responder hasta el cierre.
// Así la carga se parece a la real (varios turnos con historial creciente) y cada iteración deja
// un dato de costo por entrevista en el dashboard.
//
//   k6 run carga/entrevista.js                          # perfil "humo": 1 usuario, 1 minuto
//   k6 run -e PERFIL=carga carga/entrevista.js          # rampa a 20 usuarios en 4 minutos
//   k6 run -e PERFIL=rt9 carga/entrevista.js            # RT9 del PRD: 100 candidatos simultáneos
//   k6 run -e BASE_URL=https://tu-app.example carga/entrevista.js -e TOKEN=...
//
// Con el motor de reglas o el simulado (AGENT_MODE=reglas | simulado) no se gasta nada. Contra el motor
// de Claude, cada entrevista llama al modelo unas 5 veces: mira el costo por entrevista en el dashboard
// antes de subir el perfil, y fija un límite de gasto en la consola de Anthropic.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TOKEN = __ENV.TOKEN || '';
const PERFIL = __ENV.PERFIL || 'humo';
// Pausa entre mensajes, como una persona que lee y escribe. 0 para medir solo el servidor.
const PAUSA_S = Number(__ENV.PAUSA_S ?? 1);

const PERFILES = {
  humo: { executor: 'constant-vus', vus: 1, duration: '1m' },
  carga: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 5 },
      { duration: '2m', target: 20 },
      { duration: '1m', target: 0 },
    ],
    gracefulRampDown: '30s',
  },
  // RT9 del PRD (estacion2/specs/prd.md, sección 11.4): falla si hay contaminación entre
  // conversaciones o si alguna respuesta tarda más de 60 s.
  rt9: { executor: 'constant-vus', vus: 100, duration: '3m' },
};

export const options = {
  scenarios: { entrevistas: PERFILES[PERFIL] },
  // Los umbrales hacen que `k6 run` termine con error si no se cumplen: sirven como gate en CI.
  thresholds: {
    http_req_failed: ['rate<0.01'],
    // RT9 del PRD: ninguna respuesta puede tardar más de 60 s.
    http_req_duration: ['max<60000'],
    // RT9 del PRD: cada respuesta pertenece a la conversación que la pidió.
    'checks{verificacion:aislamiento}': ['rate==1'],
    // Objetivos propios del equipo, no del PRD. Ajústalos a tu producto y anótalos en tu ADR.
    'http_req_duration{tipo:turno}': ['p(95)<5000'],
    'http_req_duration{tipo:apertura}': ['p(95)<500'],
    entrevistas_completas: ['count>0'],
  },
  // Agrupa las URL por nombre para que k6 no cree una serie por cada conversación.
  tags: { app: 'entrevista-ai' },
};

const RESPUESTAS = [
  'Sí, acepto.',
  'Sí, tengo disponibilidad de lunes a sábado y puedo rotar turnos.',
  'Un cliente llamó molesto por un cobro doble. Lo escuché, revisé la cuenta, hice el reverso y le confirmé por correo.',
  'Un cliente necesitaba cambiar la dirección de un pedido ya despachado. Hablé con logística y lo reprogramamos ese mismo día.',
  'Me gusta resolver problemas de las personas y aprender cómo funciona el negocio.',
];

const entrevistasCompletas = new Counter('entrevistas_completas');
const turnosPorEntrevista = new Trend('turnos_por_entrevista');

function enviar(cuerpo, tipo) {
  const encabezados = { 'Content-Type': 'application/json' };
  if (TOKEN) encabezados.Authorization = `Bearer ${TOKEN}`;
  return http.post(`${BASE_URL}/api/agent`, JSON.stringify(cuerpo), {
    headers: encabezados,
    tags: { name: 'POST /api/agent', tipo },
  });
}

export default function entrevista() {
  const apertura = enviar({ mensaje: 'Hola' }, 'apertura');
  const abierta = check(apertura, {
    'apertura responde 200': (r) => r.status === 200,
    'el saludo dice que es una IA': (r) => /inteligencia artificial/i.test(r.json('respuesta') || ''),
  });
  if (!abierta) return;
  const conversacionId = apertura.json('conversacionId');

  let estado = apertura.json('estado');
  let turnos = 0;
  // Si el agente repregunta, se repite la última respuesta: el motor solo repregunta una vez por pregunta.
  for (let i = 0; estado !== 'finalizada' && estado !== 'rechazada' && turnos < 12; i++) {
    sleep(PAUSA_S);
    const r = enviar({ mensaje: RESPUESTAS[Math.min(i, RESPUESTAS.length - 1)], conversacionId }, 'turno');
    turnos++;
    if (!check(r, { 'turno responde 200': (res) => res.status === 200 })) return;
    check(r, { 'la respuesta es de esta conversación': (res) => res.json('conversacionId') === conversacionId }, { verificacion: 'aislamiento' });
    estado = r.json('estado');
  }

  check(estado, { 'la entrevista termina': (e) => e === 'finalizada' });
  if (estado === 'finalizada') {
    entrevistasCompletas.add(1);
    turnosPorEntrevista.add(turnos);
  }
}
