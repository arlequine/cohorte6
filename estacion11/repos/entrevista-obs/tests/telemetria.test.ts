import { context, metrics, trace, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { MeterProvider, MetricReader, type DataPoint, type Histogram } from '@opentelemetry/sdk-metrics';
import { InMemorySpanExporter, SimpleSpanProcessor, TracerProvider } from '@opentelemetry/sdk-trace';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { crearMotorClaude, type ClienteLLM } from '@/lib/agent';
import { iniciar, motorReglas, procesar, MAX_PREGUNTAS } from '@/lib/entrevista';
import { costoUSD } from '@/lib/precios';
import { crearClienteSimulado } from '@/lib/simulado';
import { conSpanDeAgente, contextoDeTraza, reiniciarInstrumentos } from '@/lib/telemetria';

/** Un lector de métricas que solo junta lo que hay cuando se le pide. */
class LectorEnMemoria extends MetricReader {
  protected async onShutdown() {}
  protected async onForceFlush() {}
}

const spans = new InMemorySpanExporter();
const lector = new LectorEnMemoria();
const proveedorTrazas = new TracerProvider({ spanProcessors: [new SimpleSpanProcessor({ exporter: spans })] });
const proveedorMetricas = new MeterProvider({ readers: [lector] });

beforeAll(() => {
  context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable());
  trace.setGlobalTracerProvider(proveedorTrazas);
  metrics.setGlobalMeterProvider(proveedorMetricas);
  reiniciarInstrumentos();
});

afterAll(async () => {
  await proveedorTrazas.shutdown();
  await proveedorMetricas.shutdown();
  trace.disable();
  metrics.disable();
  context.disable();
});

beforeEach(() => {
  spans.reset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

async function metrica(nombre: string) {
  const { resourceMetrics } = await lector.collect();
  return resourceMetrics.scopeMetrics.flatMap((s) => s.metrics).find((m) => m.descriptor.name === nombre);
}

function clienteFijo(uso = { input_tokens: 1000, output_tokens: 100 }) {
  const create = vi.fn().mockResolvedValue({
    id: 'msg_1',
    model: 'claude-haiku-5-5',
    stop_reason: 'tool_use',
    content: [{ type: 'tool_use', id: 't', name: 'responder_candidato', input: { tipo: 'siguiente_pregunta', texto: 'Siguiente' } }],
    usage: uso,
  });
  return { messages: { create } } as unknown as ClienteLLM;
}

describe('precios', () => {
  it('calcula el costo con la tabla de Haiku 5.5', () => {
    // 1000 × 0.10 + 100 × 0.50 = 150 USD por millón → 0.00015 USD
    expect(costoUSD('claude-haiku-5-5', { entrada: 1000, salida: 100 })).toBeCloseTo(0.00015, 10);
  });

  it('cobra la tarifa de contexto largo cuando el prompt pasa de 100 000 tokens, caché incluida', () => {
    const corto = costoUSD('claude-haiku-5-5', { entrada: 90_000, salida: 0 })!;
    const largo = costoUSD('claude-haiku-5-5', { entrada: 90_000, salida: 0, lecturaCache: 20_000 })!;
    expect(corto).toBeCloseTo(0.009, 10);
    expect(largo).toBeCloseTo((90_000 * 0.5 + 20_000 * 0.05) / 1e6, 10);
  });

  it('devuelve null para un modelo que no está en la tabla', () => {
    expect(costoUSD('modelo-desconocido', { entrada: 1, salida: 1 })).toBeNull();
  });
});

describe('spans del agente', () => {
  it('un turno con Claude deja invoke_agent como padre de chat, con atributos gen_ai.*', async () => {
    const motor = crearMotorClaude(clienteFijo(), 'claude-haiku-5-5');
    const conversacion = iniciar('c-obs-1');
    await procesar(conversacion, 'Sí', motor);
    await conSpanDeAgente(conversacion, motor, () => procesar(conversacion, 'Tengo disponibilidad', motor));

    const terminados = spans.getFinishedSpans();
    const agente = terminados.find((s) => s.name === 'invoke_agent entrevistador')!;
    const chat = terminados.find((s) => s.name === 'chat claude-haiku-5-5')!;

    expect(chat.kind).toBe(SpanKind.CLIENT);
    expect(chat.parentSpanContext?.spanId).toBe(agente.spanContext().spanId);
    expect(chat.attributes).toMatchObject({
      'gen_ai.operation.name': 'chat',
      'gen_ai.provider.name': 'anthropic',
      'gen_ai.request.model': 'claude-haiku-5-5',
      'gen_ai.response.model': 'claude-haiku-5-5',
      'gen_ai.usage.input_tokens': 1000,
      'gen_ai.usage.output_tokens': 100,
      'gen_ai.conversation.id': 'c-obs-1',
      'gen_ai.response.finish_reasons': ['tool_use'],
    });
    expect(chat.attributes['entrevista.costo.usd']).toBeCloseTo(0.00015, 10);
    expect(agente.attributes).toMatchObject({ 'gen_ai.operation.name': 'invoke_agent', 'gen_ai.agent.name': 'entrevistador', 'entrevista.motor': 'claude' });
  });

  it('suma tokens y costo a la conversación', async () => {
    const motor = crearMotorClaude(clienteFijo(), 'claude-haiku-5-5');
    const conversacion = iniciar('c-obs-2');
    await procesar(conversacion, 'Sí', motor);
    await conSpanDeAgente(conversacion, motor, () => procesar(conversacion, 'Uno', motor));
    await conSpanDeAgente(conversacion, motor, () => procesar(conversacion, 'Dos', motor));
    expect(conversacion.uso).toMatchObject({ entrada: 2000, salida: 200 });
    expect(conversacion.uso.costoUSD).toBeCloseTo(0.0003, 10);
  });

  it('los tokens de caché cuentan en gen_ai.usage.input_tokens', async () => {
    const motor = crearMotorClaude(clienteFijo({ input_tokens: 100, output_tokens: 10, cache_read_input_tokens: 900 } as never), 'claude-haiku-5-5');
    const conversacion = iniciar('c-obs-3');
    await procesar(conversacion, 'Sí', motor);
    await procesar(conversacion, 'Respuesta', motor);
    const chat = spans.getFinishedSpans().find((s) => s.name.startsWith('chat'))!;
    expect(chat.attributes['gen_ai.usage.input_tokens']).toBe(1000);
    expect(chat.attributes['gen_ai.usage.cache_read.input_tokens']).toBe(900);
  });

  it('un error del modelo marca el span con error.type y lo propaga', async () => {
    const motor = crearMotorClaude(crearClienteSimulado({ tasaError: 1, esperar: async () => {} }), 'claude-haiku-5-5', 'simulado');
    const conversacion = iniciar('c-obs-4');
    await procesar(conversacion, 'Sí', motor);
    await expect(conSpanDeAgente(conversacion, motor, () => procesar(conversacion, 'Hola', motor))).rejects.toThrow(/529/);
    const chat = spans.getFinishedSpans().find((s) => s.name.startsWith('chat'))!;
    expect(chat.status.code).toBe(SpanStatusCode.ERROR);
    expect(chat.attributes['error.type']).toBe('529');
  });

  it('el motor de reglas no deja span chat ni proveedor', async () => {
    const conversacion = iniciar('c-obs-5');
    await procesar(conversacion, 'Sí', motorReglas);
    await conSpanDeAgente(conversacion, motorReglas, () => procesar(conversacion, 'Uno', motorReglas));
    const nombres = spans.getFinishedSpans().map((s) => s.name);
    expect(nombres).toEqual(['invoke_agent entrevistador']);
    expect(spans.getFinishedSpans()[0].attributes['gen_ai.provider.name']).toBeUndefined();
  });

  it('los logs llevan el trace_id del span activo', () => {
    trace.getTracer('test').startActiveSpan('padre', (span) => {
      expect(contextoDeTraza().trace_id).toBe(span.spanContext().traceId);
      span.end();
    });
  });
});

describe('métricas', () => {
  it('registra duración, tokens por tipo y costo con los nombres de las convenciones', async () => {
    const motor = crearMotorClaude(clienteFijo(), 'claude-haiku-5-5');
    const conversacion = iniciar('c-met-1');
    await procesar(conversacion, 'Sí', motor);
    await procesar(conversacion, 'Respuesta', motor);

    const tokens = await metrica('gen_ai.client.token.usage');
    const tipos = (tokens!.dataPoints as DataPoint<Histogram>[]).map((p) => p.attributes['gen_ai.token.type']);
    expect(tipos).toEqual(expect.arrayContaining(['input', 'output']));
    expect(await metrica('gen_ai.client.operation.duration')).toBeDefined();
    expect(await metrica('entrevista.llm.costo.usd')).toBeDefined();
  });

  it('registra el costo total cuando la entrevista termina', async () => {
    const motor = crearMotorClaude(crearClienteSimulado({ tasaRepregunta: 0, esperar: async () => {} }), 'claude-haiku-5-5', 'simulado');
    const conversacion = iniciar('c-met-2');
    await procesar(conversacion, 'Sí', motor);
    for (let i = 0; i < MAX_PREGUNTAS; i++) await conSpanDeAgente(conversacion, motor, () => procesar(conversacion, 'Respuesta concreta', motor));
    expect(conversacion.estado).toBe('finalizada');

    const costo = await metrica('entrevista.conversacion.costo.usd');
    const punto = (costo!.dataPoints as DataPoint<Histogram>[]).find((p) => p.attributes['entrevista.motor'] === 'simulado')!;
    expect(punto.value.count).toBe(1);
    expect(punto.value.sum).toBeCloseTo(conversacion.uso.costoUSD, 10);
    expect(conversacion.uso.costoUSD).toBeGreaterThan(0);
  });
});

describe('cliente simulado', () => {
  it('avanza por las preguntas y los tokens de entrada crecen con el historial', async () => {
    const motor = crearMotorClaude(crearClienteSimulado({ tasaRepregunta: 0, esperar: async () => {} }), 'claude-haiku-5-5', 'simulado');
    const conversacion = iniciar('c-sim');
    await procesar(conversacion, 'Sí', motor);
    const primera = await procesar(conversacion, 'Sí tengo disponibilidad', motor);
    const segunda = await procesar(conversacion, 'Un cliente estaba molesto por un cobro doble', motor);
    expect(primera.respuesta).toMatch(/cliente molesto/);
    expect(segunda.tokens!.entrada).toBeGreaterThan(primera.tokens!.entrada);
  });
});
