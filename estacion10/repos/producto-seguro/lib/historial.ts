import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

/**
 * Historial de conversaciones en DynamoDB.
 *
 * La tabla la crea Terraform (infra/). En Vercel las credenciales usan el prefijo APP_AWS_
 * porque Vercel reserva los nombres AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY y AWS_REGION.
 * En local, APP_AWS_ENDPOINT apunta a LocalStack (http://localhost:4566).
 */

const DIAS_DE_RETENCION = 30;

export interface Conversacion {
  id: string;
  creado_en: string;
  mensaje: string;
  respuesta: string;
  modelo: string;
  tokens_entrada: number;
  tokens_salida: number;
  expira_en: number;
}

/** La parte del cliente de DynamoDB que usa el historial. Permite inyectar un doble en los tests. */
export type ClienteDynamo = Pick<DynamoDBDocumentClient, 'send'>;

export function historialHabilitado(): boolean {
  return Boolean(process.env.DYNAMODB_TABLE);
}

let clientePorDefecto: ClienteDynamo | null = null;
function obtenerCliente(): ClienteDynamo {
  if (!clientePorDefecto) {
    const accessKeyId = process.env.APP_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.APP_AWS_SECRET_ACCESS_KEY;
    const base = new DynamoDBClient({
      region: process.env.APP_AWS_REGION ?? 'us-east-1',
      endpoint: process.env.APP_AWS_ENDPOINT || undefined,
      credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
    });
    clientePorDefecto = DynamoDBDocumentClient.from(base);
  }
  return clientePorDefecto;
}

function tabla(): string {
  const nombre = process.env.DYNAMODB_TABLE;
  if (!nombre) throw new Error('DYNAMODB_TABLE no está definida');
  return nombre;
}

export async function guardarConversacion(
  datos: Omit<Conversacion, 'id' | 'creado_en' | 'expira_en'>,
  cliente: ClienteDynamo = obtenerCliente(),
  ahora: Date = new Date(),
): Promise<Conversacion> {
  const conversacion: Conversacion = {
    id: randomUUID(),
    creado_en: ahora.toISOString(),
    expira_en: Math.floor(ahora.getTime() / 1000) + DIAS_DE_RETENCION * 24 * 60 * 60,
    ...datos,
  };
  await cliente.send(new PutCommand({ TableName: tabla(), Item: conversacion }));
  return conversacion;
}

/** Devuelve las conversaciones más recientes. Un Scan basta para el volumen de este ejercicio. */
export async function ultimasConversaciones(limite = 10, cliente: ClienteDynamo = obtenerCliente()): Promise<Conversacion[]> {
  const resultado = await cliente.send(new ScanCommand({ TableName: tabla() }));
  const items = (resultado.Items ?? []) as Conversacion[];
  return items.sort((a, b) => b.creado_en.localeCompare(a.creado_en)).slice(0, limite);
}
