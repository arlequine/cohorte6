# Walking skeleton · solución de referencia

Estado final esperado al terminar la Estación 3. Parte de [`plantilla-alumno/`](../../../plantilla-alumno), que es el repo con el que cada alumno empieza en la Nivelación 1.

Sirve para dos cosas:
- **Al mentor:** es la demo de la estación y el plan B si algo falla en vivo.
- **Al alumno:** puede compararla con su repo cuando termine. Conviene no copiarla: lo que se evalúa es cómo dirigiste al agente para llegar ahí.

## Qué agrega respecto a la plantilla

| Pieza | Archivos |
|---|---|
| Agente que responde con Claude | `lib/agent.ts`, `app/api/agent/route.ts` |
| Página con formulario | `app/page.tsx` |
| Logs estructurados en JSON | `lib/logger.ts` |
| Tests del agente y de la ruta, sin llamar a la API real | `tests/agent.test.ts`, `tests/route.test.ts` |
| Protección del endpoint con token | `AGENT_ACCESS_TOKEN` en `app/api/agent/route.ts` |
| Una skill propia del proyecto | `.agents/skills/nuevo-endpoint/` |
| Secret scanning en CI | job `secretos` en `.github/workflows/ci.yml` |
| `AGENTS.md` completo | `AGENTS.md` |

## Correr en local

```bash
npm install
cp .env.example .env   # y pon tu ANTHROPIC_API_KEY
npm run dev            # http://localhost:3000
npm run verify         # lint + tipos + tests
```

## Endpoints

| Método y ruta | Cuerpo | Respuesta |
|---|---|---|
| `GET /api/health` | — | `{ "estado": "ok" }` |
| `POST /api/agent` | `{ "mensaje": "..." }` (máximo 1000 caracteres) | `{ "respuesta", "modelo", "tokens": { "entrada", "salida" } }` |

Si `AGENT_ACCESS_TOKEN` está definido, `POST /api/agent` exige `Authorization: Bearer <token>`.

## Desplegar en Vercel

1. Sube el repo a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repo. Vercel detecta Next.js solo.
3. En **Settings → Environment Variables**, agrega `ANTHROPIC_API_KEY` y `AGENT_ACCESS_TOKEN` (genera uno con `openssl rand -hex 24`).
4. Despliega. Cada push a `main` vuelve a desplegar, y cada pull request tiene su propia URL de vista previa.

Alternativa por terminal: `npx vercel`, luego `npx vercel env add ANTHROPIC_API_KEY` y `npx vercel --prod`.

> Antes de desplegar, fija un límite de gasto en la [consola de Anthropic](https://console.anthropic.com). La URL es pública: el token y el límite evitan que alguien más gaste tu saldo.

## Notas

- El modelo por defecto es `claude-haiku-5-5`, el más económico para este uso. Cámbialo con `ANTHROPIC_MODEL`.
- La acción de gitleaks es gratuita en cuentas personales. En repos de una organización de GitHub pide una licencia (`GITLEAKS_LICENSE`).
