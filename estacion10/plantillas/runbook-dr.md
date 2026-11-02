# Runbook de recuperación ante desastres

**Producto:** 
**Última prueba de restauración:** fecha y resultado

## Objetivos

| Objetivo | Valor | Qué significa |
|---|---|---|
| RPO (pérdida máxima de datos) | | Cuántos datos estás dispuesto a perder, medido en tiempo |
| RTO (tiempo máximo sin servicio) | | En cuánto tiempo debe volver el servicio |

## Qué se puede recuperar y cómo

| Componente | Respaldo | Cómo se recupera |
|---|---|---|
| Código | Git (GitHub) | |
| Infraestructura | Terraform en `infra/` y el estado en S3 con versiones | |
| Datos | | |
| Secretos y configuración | | |

## Escenarios

### E1 · Se borraron o corrompieron datos
1. Detectar: ¿cómo te enteras?
2. Contener: ¿qué detienes para que no empeore?
3. Restaurar: pasos y comandos exactos.
4. Verificar: ¿cómo compruebas que los datos están bien?
5. Comunicar: ¿a quién avisas?

### E2 · Se borró un recurso de infraestructura

### E3 · Se filtró un secreto
Qué secreto, dónde se rota y qué más hay que revisar.

## Registro de pruebas

| Fecha | Escenario | Quién | Tiempo real | Resultado |
|---|---|---|---|---|
| | | | | |
