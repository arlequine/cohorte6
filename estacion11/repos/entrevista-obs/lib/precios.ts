/**
 * Precios por token de los modelos que usa EntreVista AI, en USD por millón de tokens.
 *
 * Fuente: https://platform.claude.com/docs/en/about-claude/pricing (revisado el 9 de noviembre de 2026).
 * Si cambian, actualiza esta tabla y `versions.md` del repo del programa. Ninguna convención de
 * OpenTelemetry define el costo: se calcula aquí a partir de los tokens que reporta la API.
 */

export interface Precio {
  entrada: number;
  salida: number;
  /** Escritura de caché de 5 minutos. */
  escrituraCache: number;
  /** Lecturas y refrescos de caché. */
  lecturaCache: number;
}

interface TarifaModelo {
  base: Precio;
  /** Haiku 5.5 cobra más cuando el prompt completo (entrada + caché) pasa del umbral. */
  contextoLargo?: { umbral: number; precio: Precio };
}

export const TARIFAS: Record<string, TarifaModelo> = {
  'claude-haiku-5-5': {
    base: { entrada: 0.1, salida: 0.5, escrituraCache: 0.125, lecturaCache: 0.01 },
    contextoLargo: { umbral: 100_000, precio: { entrada: 0.5, salida: 2.5, escrituraCache: 0.625, lecturaCache: 0.05 } },
  },
  'claude-sonnet-5-5': { base: { entrada: 2, salida: 10, escrituraCache: 2.5, lecturaCache: 0.1 } },
  'claude-opus-5-5': { base: { entrada: 4, salida: 20, escrituraCache: 5, lecturaCache: 0.2 } },
};

export interface UsoTokens {
  /** Tokens de entrada sin caché (`usage.input_tokens` de la API de Anthropic). */
  entrada: number;
  salida: number;
  /** `usage.cache_read_input_tokens` */
  lecturaCache?: number;
  /** `usage.cache_creation_input_tokens` */
  escrituraCache?: number;
}

/** Costo de una llamada en USD, o `null` si el modelo no está en la tabla. */
export function costoUSD(modelo: string, uso: UsoTokens): number | null {
  const tarifa = TARIFAS[modelo];
  if (!tarifa) return null;
  const lectura = uso.lecturaCache ?? 0;
  const escritura = uso.escrituraCache ?? 0;
  const prompt = uso.entrada + lectura + escritura;
  const precio = tarifa.contextoLargo && prompt > tarifa.contextoLargo.umbral ? tarifa.contextoLargo.precio : tarifa.base;
  const total =
    uso.entrada * precio.entrada + uso.salida * precio.salida + escritura * precio.escrituraCache + lectura * precio.lecturaCache;
  return total / 1_000_000;
}
