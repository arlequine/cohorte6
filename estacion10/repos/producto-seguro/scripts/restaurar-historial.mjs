#!/usr/bin/env node
// Copia las conversaciones de una tabla restaurada (point-in-time recovery) a la tabla original.
// Es el paso 4 del runbook de recuperación (docs/runbook-dr.md). Se corre a mano, con credenciales
// de un administrador, nunca desde el pipeline.
//
// Uso:
//   node scripts/restaurar-historial.mjs --origen <tabla-restaurada> --destino <tabla-original> [--aplicar]
//
// Sin --aplicar solo cuenta cuántos registros copiaría. Usa la región de AWS_REGION (por defecto us-east-1).

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand, DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

function argumento(nombre) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const origen = argumento('origen');
const destino = argumento('destino');
const aplicar = process.argv.includes('--aplicar');

if (!origen || !destino) {
  console.error('Uso: node scripts/restaurar-historial.mjs --origen <tabla-restaurada> --destino <tabla-original> [--aplicar]');
  process.exit(1);
}
if (origen === destino) {
  console.error('El origen y el destino deben ser tablas distintas.');
  process.exit(1);
}

const cliente = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' }));

let total = 0;
let inicio;
do {
  const pagina = await cliente.send(new ScanCommand({ TableName: origen, ExclusiveStartKey: inicio }));
  const items = pagina.Items ?? [];
  total += items.length;

  if (aplicar) {
    // BatchWrite acepta hasta 25 elementos por llamada.
    for (let i = 0; i < items.length; i += 25) {
      const lote = items.slice(i, i + 25).map((Item) => ({ PutRequest: { Item } }));
      let pendientes = { [destino]: lote };
      while (pendientes && Object.keys(pendientes).length > 0) {
        const respuesta = await cliente.send(new BatchWriteCommand({ RequestItems: pendientes }));
        pendientes = respuesta.UnprocessedItems;
      }
    }
  }
  inicio = pagina.LastEvaluatedKey;
} while (inicio);

console.log(aplicar ? `Copiadas ${total} conversaciones de ${origen} a ${destino}.` : `Se copiarían ${total} conversaciones de ${origen} a ${destino}. Agrega --aplicar para hacerlo.`);
