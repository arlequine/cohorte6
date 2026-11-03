# Reporte de seguridad

**Producto:** 
**URL de producción:** 
**Fecha:** 
**Autor:** 

## Resumen
Dos o tres frases: qué revisaste, cuántos hallazgos encontraste y cuántos cerraste.

| Severidad | Encontrados | Cerrados | Aceptados | Abiertos |
|---|---|---|---|---|
| Crítica | | | | |
| Alta | | | | |
| Media | | | | |
| Baja | | | | |

## Qué se revisó

| Control | Herramienta | Resultado |
|---|---|---|
| Secretos en el repo | gitleaks (CI) | |
| Código (SAST) | Semgrep (CI) | |
| Dependencias (SCA) | `npm audit` (CI) y Dependabot | |
| Infraestructura | Semgrep `p/terraform` y revisión de IAM | |
| Riesgos del agente | Modelo de amenazas (OWASP Agentic) y `scripts/red-team.mjs` | |
| Recuperación | Runbook de DR y prueba de restauración | |

## Hallazgos

Copia este bloque por cada hallazgo. Al menos uno debe quedar **cerrado y verificado**.

### H1 · Título corto

| Campo | Valor |
|---|---|
| Severidad | Crítica / Alta / Media / Baja |
| Categoría | Por ejemplo: ASI01, ASI03, OWASP A01, cadena de suministro |
| Estado | Abierto / Cerrado / Aceptado |
| Dónde | Archivo, endpoint o recurso |

**Qué pasa.** Una o dos frases.

**Cómo se reproduce.** Pasos, comando o prompt exacto.

**Impacto.** Qué podría hacer alguien con esto.

**Cómo se cerró.** El cambio que lo corrige, con el enlace al PR.

**Evidencia de verificación.** La prueba que demuestra que ya no ocurre: el test, la corrida del red team o la salida del escáner después del cambio.

Si el estado es **Aceptado**: por qué se acepta el riesgo, quién lo decidió y cuándo se revisa de nuevo.

## Próximos pasos
Los hallazgos abiertos, con su responsable y fecha.
