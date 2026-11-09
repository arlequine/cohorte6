import { SpanKind, SpanStatusCode, metrics, trace, type Attributes, type Counter, type Histogram, type Span } from '@opentelemetry/api';
import { costoUSD } from '@/lib/precios';
import type { Conversacion, Motor, Tokens } from '@/lib/entrevista';

/**
 * Telemetría del agente de EntreVista AI.
 *
 * Sigue las convenciones semánticas de GenAI de OpenTelemetry (`gen_ai.*`). Esas convenciones están en
 * estado **Development** y desde junio de 2026 viven en su propio repo (open-telemetry/semantic-conventions-genai):
 * los nombres pueden cambiar sin período de deprecación. Por eso todos los nombres están en este archivo
 * y en ningún otro: si cambian, se cambian aquí.
 *
 * Lo que no está en las convenciones (costo, motor, estado de la entrevista) va con el prefijo
 * `entrevista.`, para que nunca choque con un nombre futuro de `gen_ai.*`.
 *
 * Si no hay un SDK de OpenTelemetry registrado (tests, `next build`, despliegues sin Collector), la API
 * devuelve implementaciones vacías y nada de esto cuesta ni falla.
 */

export const GEN_AI = {
  operacion: 'gen_ai.operation.name',
  proveedor: 'gen_ai.provider.name',
  agenteNombre: 'gen_ai.agent.name',
  conversacionId: 'gen_ai.conversation.id',
  modeloPedido: 'gen_ai.request.model',
  maxTokens: 'gen_ai.request.max_tokens',
  modeloRespuesta: 'gen_ai.response.model',
  respuestaId: 'gen_ai.response.id',
  razonesFin: 'gen_ai.response.finish_reasons',
  tokensEntrada: 'gen_ai.usage.input_tokens',
  tokensSalida: 'gen_ai.usage.output_tokens',
  tokensLecturaCache: 'gen_ai.usage.cache_read.input_tokens',
  tokensEscrituraCache: 'gen_ai.usage.cache_creation.input_tokens',
  tipoToken: 'gen_ai.token.type',
  tipoError: 'error.type',
  servidor: 'server.address',
} as const;

export const ENTREVISTA = {
  motor: 'entrevista.motor',
  estado: 'entrevista.estado',
  pregunta: 'entrevista.pregunta',
  costo: 'entrevista.costo.usd',
  costoConversacion: 'entrevista.conversacion.costo.usd',
} as const;

export const NOMBRE_AGENTE = 'entrevistador';
const PROVEEDOR = 'anthropic';
const ALCANCE = 'entrevista-ai';

const tracer = () => trace.getTracer(ALCANCE);

interface Instrumentos {
  duracionOperacion: Histogram;
  usoTokens: Histogram;
  duracionAgente: Histogram;
  costo: Counter;
  costoConversacion: Histogram;
  conversaciones: Counter;
}

let instrumentos: Instrumentos | undefined;

/**
 * Los instrumentos se crean en el primer uso y no al importar el módulo: la API de métricas no tiene
 * un proveedor "proxy" como la de traces, y un instrumento creado antes de que arranque el SDK se queda vacío.
 */
function medir(): Instrumentos {
  if (instrumentos) return instrumentos;
  const meter = metrics.getMeter(ALCANCE);
  instrumentos = {
    duracionOperacion: meter.createHistogram('gen_ai.client.operation.duration', {
      unit: 's',
      description: 'Duración de cada llamada al modelo.',
      advice: { explicitBucketBoundaries: [0.01, 0.02, 0.04, 0.08, 0.16, 0.32, 0.64, 1.28, 2.56, 5.12, 10.24, 20.48, 40.96, 81.92] },
    }),
    usoTokens: meter.createHistogram('gen_ai.client.token.usage', {
      unit: '{token}',
      description: 'Tokens por llamada al modelo, separados por gen_ai.token.type.',
      advice: { explicitBucketBoundaries: [1, 4, 16, 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576] },
    }),
    duracionAgente: meter.createHistogram('gen_ai.invoke_agent.duration', {
      unit: 's',
      description: 'Duración de un turno del agente, con o sin llamada al modelo.',
      advice: { explicitBucketBoundaries: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30] },
    }),
    costo: meter.createCounter('entrevista.llm.costo.usd', {
      unit: '{USD}',
      description: 'Costo acumulado de las llamadas al modelo, calculado con lib/precios.ts.',
    }),
    costoConversacion: meter.createHistogram(ENTREVISTA.costoConversacion, {
      unit: '{USD}',
      description: 'Costo total de una entrevista, registrado cuando termina.',
      advice: { explicitBucketBoundaries: [0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1] },
    }),
    conversaciones: meter.createCounter('entrevista.conversaciones', {
      unit: '{conversacion}',
      description: 'Entrevistas terminadas, por estado final (finalizada o rechazada).',
    }),
  };
  return instrumentos;
}

/** Solo para tests: obliga a crear los instrumentos otra vez con el proveedor de métricas actual. */
export function reiniciarInstrumentos(): void {
  instrumentos = undefined;
}

/** Todos los tokens de entrada, con caché incluida, como piden las convenciones para `gen_ai.usage.input_tokens`. */
export function tokensDeEntrada(tokens: Tokens): number {
  return tokens.entrada + (tokens.lecturaCache ?? 0) + (tokens.escrituraCache ?? 0);
}

function tipoDeError(e: unknown): string {
  if (e && typeof e === 'object' && 'status' in e && typeof e.status === 'number') return String(e.status);
  return e instanceof Error ? e.constructor.name : 'Error';
}

function registrarError(span: Span, e: unknown): string {
  const tipo = tipoDeError(e);
  span.setAttribute(GEN_AI.tipoError, tipo);
  span.recordException(e instanceof Error ? e : new Error(String(e)));
  span.setStatus({ code: SpanStatusCode.ERROR, message: e instanceof Error ? e.message : String(e) });
  return tipo;
}

/** Lo que devuelve la API de Anthropic y la telemetría necesita. */
export interface RespuestaModelo {
  id?: string;
  model?: string;
  stop_reason?: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number | null;
    cache_creation_input_tokens?: number | null;
  };
}

/**
 * Envuelve una llamada al modelo en un span `chat {modelo}` (SpanKind.CLIENT) y registra sus métricas.
 * Devuelve la respuesta del modelo sin tocarla.
 */
export async function conSpanDeModelo<R extends RespuestaModelo>(
  datos: { modelo: string; maxTokens: number; conversacionId?: string },
  llamada: () => Promise<R>,
): Promise<R> {
  const base: Attributes = {
    [GEN_AI.operacion]: 'chat',
    [GEN_AI.proveedor]: PROVEEDOR,
    [GEN_AI.modeloPedido]: datos.modelo,
  };
  const atributos: Attributes = { ...base, [GEN_AI.maxTokens]: datos.maxTokens, [GEN_AI.servidor]: 'api.anthropic.com' };
  if (datos.conversacionId) atributos[GEN_AI.conversacionId] = datos.conversacionId;

  return tracer().startActiveSpan(`chat ${datos.modelo}`, { kind: SpanKind.CLIENT, attributes: atributos }, async (span) => {
    const inicio = performance.now();
    try {
      const respuesta = await llamada();
      const modeloRespuesta = respuesta.model ?? datos.modelo;
      const tokens: Tokens = {
        entrada: respuesta.usage.input_tokens,
        salida: respuesta.usage.output_tokens,
        lecturaCache: respuesta.usage.cache_read_input_tokens ?? 0,
        escrituraCache: respuesta.usage.cache_creation_input_tokens ?? 0,
      };
      const costo = costoUSD(modeloRespuesta, tokens);

      span.setAttributes({
        [GEN_AI.modeloRespuesta]: modeloRespuesta,
        [GEN_AI.tokensEntrada]: tokensDeEntrada(tokens),
        [GEN_AI.tokensSalida]: tokens.salida,
        [GEN_AI.tokensLecturaCache]: tokens.lecturaCache ?? 0,
        [GEN_AI.tokensEscrituraCache]: tokens.escrituraCache ?? 0,
      });
      if (respuesta.id) span.setAttribute(GEN_AI.respuestaId, respuesta.id);
      if (respuesta.stop_reason) span.setAttribute(GEN_AI.razonesFin, [respuesta.stop_reason]);
      if (costo !== null) span.setAttribute(ENTREVISTA.costo, costo);

      const conModelo = { ...base, [GEN_AI.modeloRespuesta]: modeloRespuesta };
      const m = medir();
      m.duracionOperacion.record((performance.now() - inicio) / 1000, conModelo);
      m.usoTokens.record(tokensDeEntrada(tokens), { ...conModelo, [GEN_AI.tipoToken]: 'input' });
      m.usoTokens.record(tokens.salida, { ...conModelo, [GEN_AI.tipoToken]: 'output' });
      if (costo !== null) m.costo.add(costo, { [GEN_AI.modeloRespuesta]: modeloRespuesta });
      return respuesta;
    } catch (e) {
      const tipo = registrarError(span, e);
      medir().duracionOperacion.record((performance.now() - inicio) / 1000, { ...base, [GEN_AI.tipoError]: tipo });
      throw e;
    } finally {
      span.end();
    }
  });
}

/**
 * Envuelve un turno de la entrevista en un span `invoke_agent entrevistador`. Si el motor llama al modelo,
 * el span `chat` queda como hijo. Al final suma tokens y costo a la conversación y, si la entrevista
 * terminó en este turno, registra su costo total.
 */
export async function conSpanDeAgente<R extends { tokens?: Tokens }>(
  conversacion: Conversacion,
  motor: Motor,
  turno: () => Promise<R>,
): Promise<R> {
  const base: Attributes = {
    [GEN_AI.operacion]: 'invoke_agent',
    [GEN_AI.agenteNombre]: NOMBRE_AGENTE,
    [ENTREVISTA.motor]: motor.tipo,
  };
  if (motor.tipo !== 'reglas') {
    base[GEN_AI.proveedor] = PROVEEDOR;
    base[GEN_AI.modeloPedido] = motor.nombre;
  }
  const estadoInicial = conversacion.estado;

  return tracer().startActiveSpan(
    `invoke_agent ${NOMBRE_AGENTE}`,
    { kind: SpanKind.INTERNAL, attributes: { ...base, [GEN_AI.conversacionId]: conversacion.id } },
    async (span) => {
      const inicio = performance.now();
      try {
        const resultado = await turno();
        const tokens = resultado.tokens;
        if (tokens && motor.tipo !== 'reglas') {
          const costo = costoUSD(motor.nombre, tokens) ?? 0;
          conversacion.uso.entrada += tokensDeEntrada(tokens);
          conversacion.uso.salida += tokens.salida;
          conversacion.uso.costoUSD += costo;
          span.setAttributes({
            [GEN_AI.tokensEntrada]: tokensDeEntrada(tokens),
            [GEN_AI.tokensSalida]: tokens.salida,
            [ENTREVISTA.costo]: costo,
          });
        }
        span.setAttributes({ [ENTREVISTA.estado]: conversacion.estado, [ENTREVISTA.pregunta]: conversacion.preguntasHechas });

        const termino = estadoInicial !== conversacion.estado && (conversacion.estado === 'finalizada' || conversacion.estado === 'rechazada');
        if (termino) {
          const m = medir();
          m.conversaciones.add(1, { [ENTREVISTA.estado]: conversacion.estado, [ENTREVISTA.motor]: motor.tipo });
          m.costoConversacion.record(conversacion.uso.costoUSD, { [ENTREVISTA.motor]: motor.tipo, [ENTREVISTA.estado]: conversacion.estado });
          span.setAttribute(ENTREVISTA.costoConversacion, conversacion.uso.costoUSD);
        }
        medir().duracionAgente.record((performance.now() - inicio) / 1000, base);
        return resultado;
      } catch (e) {
        const tipo = registrarError(span, e);
        medir().duracionAgente.record((performance.now() - inicio) / 1000, { ...base, [GEN_AI.tipoError]: tipo });
        throw e;
      } finally {
        span.end();
      }
    },
  );
}

/** El trace y el span activos, para escribirlos en cada línea de log. */
export function contextoDeTraza(): { trace_id?: string; span_id?: string } {
  const span = trace.getActiveSpan();
  if (!span) return {};
  const { traceId, spanId, traceFlags } = span.spanContext();
  // Sin SDK, el span es un no-op con IDs en cero: no tiene sentido escribirlos.
  if (!traceFlags && /^0+$/.test(traceId)) return {};
  return { trace_id: traceId, span_id: spanId };
}
