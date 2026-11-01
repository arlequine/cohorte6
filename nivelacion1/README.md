# Nivelación 1 · Tu entorno y tu punto de partida

## Objetivo
Terminar la semana 1 con tu entorno de trabajo funcionando, tu repo personal creado y tu track asignado (base o avanzado).

Es asíncrona: avanza a tu ritmo durante la semana. Calcula entre 3 y 4 horas en total. Después sigue la [Nivelación 2](../nivelacion2/demo-paso-a-paso.md), donde construyes tu primer agente.

## Antes de empezar
- Una computadora con macOS, Linux o Windows con WSL 2, y permisos para instalar software
- Una cuenta de GitHub
- Una cuenta para el coding agent que vayas a usar (ver "Elige tu coding agent")

## Ruta de la semana

| Parte | Tiempo | Resultado |
|---|---|---|
| 1. Instalar y verificar tu entorno | 60–90 min | `verificar-entorno.sh` sin errores en lo obligatorio |
| 2. Crear tu repo personal | 15 min | Repo `ai4dev-<tu-usuario>` en GitHub, creado desde la plantilla |
| 3. Diagnóstico | 30 min | Autoevaluación completa |
| 4. Reto práctico | 45 min | Una función con tests, hecha con tu coding agent |
| 5. Entregar | 10 min | `nivelacion/entrega.md` en tu repo |
| 6. Nivelar lo que falte | Variable | Recursos de la sección "Si tu diagnóstico mostró huecos" |

## 1. Instala y verifica tu entorno

### Obligatorio desde ya

| Herramienta | Versión mínima | Cómo instalar |
|---|---|---|
| Git | 2.40 | [git-scm.com](https://git-scm.com/downloads) |
| Node.js | 20 (recomendado 22) | [nodejs.org](https://nodejs.org) o `nvm install 22` |
| GitHub CLI (`gh`) | 2.40 | [cli.github.com](https://cli.github.com), luego `gh auth login` |
| Un coding agent | La más reciente | Ver "Elige tu coding agent" |

### Elige tu coding agent

Puedes usar cualquiera de estas cinco herramientas. **Las demos y el soporte garantizado de los mentores son en Claude Code**: si no tienes preferencia, usa esa. Si eliges otra, cada guía trae una tabla de equivalencias y puedes resolver dudas en el grupo de la cohorte.

| Herramienta | Cuenta que necesitas | Cómo instalar | Documentación |
|---|---|---|---|
| **Claude Code** (referencia) | Claude Pro o Max, o API de Anthropic | `curl -fsSL https://claude.ai/install.sh \| bash`<br>Windows: `irm https://claude.ai/install.ps1 \| iex`<br>Luego `claude` y `/login` | [code.claude.com/docs](https://code.claude.com/docs) |
| **Cursor** | Cuenta de Cursor | App desde [cursor.com](https://cursor.com). CLI opcional: `curl https://cursor.com/install -fsS \| bash` | [cursor.com/docs](https://cursor.com/docs) |
| **Codex** | ChatGPT de pago o llave de API de OpenAI | `npm install -g @openai/codex` o `brew install --cask codex`<br>Luego `codex` para iniciar sesión | [developers.openai.com/codex](https://developers.openai.com/codex) |
| **Antigravity** | Cuenta de Google | CLI: `curl -fsSL https://antigravity.google/cli/install.sh \| bash` (comando `agy`). App e IDE desde [antigravity.google](https://antigravity.google) | [antigravity.google/docs](https://antigravity.google/docs) |
| **GitHub Copilot** | Cualquier plan de Copilot | Extensión de VS Code o JetBrains. CLI: `npm install -g @github/copilot` (requiere Node 22) o `brew install copilot-cli`; luego `copilot` y `/login` | [docs.github.com/copilot](https://docs.github.com/copilot) |

Las cinco leen el mismo archivo de instrucciones, `AGENTS.md`, y las mismas skills en formato `SKILL.md`. Por eso los ejercicios del programa funcionan con cualquiera. Lo que cambia entre herramientas es dónde se configuran MCP y hooks; las guías te dan la configuración de cada una cuando haga falta.

### Lo vas a necesitar más adelante

Puedes instalarlo ahora o en la semana indicada. Instalarlo ahora te ahorra sorpresas.

| Herramienta o cuenta | Para qué | Antes de |
|---|---|---|
| Supabase (cuenta gratuita) | Primer agente con MCP | Nivelación 2 |
| Docker Desktop o Docker Engine | LocalStack y el stack de observabilidad | Semana 6 |
| Llave de API de OpenAI con saldo | Agentes de ejemplo y evaluaciones | Semana 5 |
| Linear (cuenta gratuita) | Planeación y orquestación de tareas | Semana 4 |
| Terraform 1.5 o superior y AWS CLI | Infraestructura como código | Semana 6 |
| `jq` | Scripts de verificación | Semana 6 |

### Verifica

Desde la raíz de este repo:

```bash
bash nivelacion1/verificar-entorno.sh
```

El script revisa cada herramienta y te dice qué falta. Lo obligatorio debe salir en verde; lo de "más adelante" puede salir en amarillo por ahora.

## 2. Crea tu repo personal

Ahí vas a construir tu producto durante todo el programa y ahí vas a entregar cada estación. Parte de [`plantilla-alumno/`](../plantilla-alumno), que ya trae una app Next.js, tests, CI, `AGENTS.md` y las carpetas para tus entregables.

```bash
npx degit arlequine/cohorte6/plantilla-alumno ai4dev-<tu-usuario>
cd ai4dev-<tu-usuario>
git init -b main && git add . && git commit -m "Repo inicial desde la plantilla"
gh repo create ai4dev-<tu-usuario> --private --source . --push
npm install && npm run hooks && npm run verify
cp <ruta-a-cohorte6>/nivelacion1/plantilla-entrega.md nivelacion/entrega.md
```

`npm run verify` debe terminar sin errores: es la misma verificación que corre el CI de tu repo en cada push.

Agrega a los mentores como colaboradores cuando te compartan sus usuarios.

## 3. Haz el diagnóstico

Abre [`diagnostico.md`](diagnostico.md) y califícate con honestidad. Este diagnóstico no cuenta para tu calificación: sirve para ubicarte en el track correcto y para que los mentores sepan dónde apoyarte.

## 4. Resuelve el reto práctico

Está al final de [`diagnostico.md`](diagnostico.md). Hazlo dentro de tu repo personal, con tu coding agent, en una carpeta `nivelacion/reto/`. Máximo 45 minutos: si no terminas, entrega lo que tengas y anota dónde te atoraste.

## Tu tarea
1. Corre `verificar-entorno.sh` hasta que lo obligatorio salga en verde.
2. Crea tu repo personal.
3. Completa el diagnóstico y el reto.
4. Llena `nivelacion/entrega.md` y súbelo a tu repo.
5. Sigue con la Nivelación 2.

## Entregable
Tu repo `ai4dev-<tu-usuario>` con:
- `nivelacion/entrega.md` completo
- `nivelacion/reto/` con el código y los tests del reto

Comparte el enlace del repo en el formulario de la cohorte antes de la Estación 1.

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Entorno | Todo lo obligatorio en verde | Falta una herramienta obligatoria | Faltan dos o más |
| Repo personal | Creado, con `entrega.md` y el reto | Creado, con entregable incompleto | No existe |
| Diagnóstico | Las 20 preguntas calificadas | Incompleto | No entregado |
| Reto | Tests pasando y notas sobre cómo trabajaste con el agente | Código sin tests o tests fallando | No entregado |

## Cómo alimenta la siguiente estación
- La Nivelación 2 usa tu coding agent para construir tu primer agente con MCP.
- Tu repo personal es donde vas a guardar el Product Vision Board de la Estación 1 y, en la semana 3, tu walking skeleton.
- El track que te toque decide qué retos opcionales te sugerimos en cada estación.

## Track avanzado
Si tu diagnóstico te ubica en el track avanzado, agrega a tu reto un `AGENTS.md` con las convenciones de tu repo y una forma de correr los tests automáticamente: un hook de tu herramienta o un hook de pre-commit de git. Anota si cambió la calidad del resultado.

## Si tu diagnóstico mostró huecos

| Área | Empieza por |
|---|---|
| Git y pull requests | [Pro Git, capítulos 2 y 3](https://git-scm.com/book/es/v2) y [GitHub Skills](https://skills.github.com) |
| TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Tests | [Guía de Vitest](https://vitest.dev/guide/) |
| APIs HTTP | [MDN: visión general de HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Overview) |
| Docker | [Docker: Get started](https://docs.docker.com/get-started/) |
| LLMs y agentes | La documentación de tu coding agent (tabla de arriba), [agents.md](https://agents.md) y la [introducción a MCP](https://modelcontextprotocol.io/introduction) |

Puedes llevar tus dudas a la sesión de refuerzo de la semana o al grupo de la cohorte.

## Recursos
Enlaces revisados el 31 de octubre de 2026. Las versiones fijadas para toda la cohorte están en [`versions.md`](../versions.md).
