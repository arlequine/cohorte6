# Nivelación 1 · Tu entorno y tu punto de partida

## Objetivo
Terminar la semana 1 con tu entorno de trabajo funcionando, tu repo personal creado y tu track asignado (base o avanzado).

Es asíncrona: avanza a tu ritmo durante la semana. Calcula entre 3 y 4 horas en total. Después sigue la [Nivelación 2](../nivelacion2/demo-paso-a-paso.md), donde construyes tu primer agente.

## Antes de empezar
- Una computadora con macOS, Linux o Windows con WSL 2, y permisos para instalar software
- Una cuenta de GitHub
- Una cuenta de Claude con plan Pro o Max, o una cuenta de la API de Anthropic

## Ruta de la semana

| Parte | Tiempo | Resultado |
|---|---|---|
| 1. Instalar y verificar tu entorno | 60–90 min | `verificar-entorno.sh` sin errores en lo obligatorio |
| 2. Crear tu repo personal | 15 min | Repo `ai4dev-<tu-usuario>` en GitHub |
| 3. Diagnóstico | 30 min | Autoevaluación completa |
| 4. Reto práctico | 45 min | Una función con tests, hecha con Claude Code |
| 5. Entregar | 10 min | `nivelacion/entrega.md` en tu repo |
| 6. Nivelar lo que falte | Variable | Recursos de la sección "Si tu diagnóstico mostró huecos" |

## 1. Instala y verifica tu entorno

### Obligatorio desde ya

| Herramienta | Versión mínima | Cómo instalar |
|---|---|---|
| Git | 2.40 | [git-scm.com](https://git-scm.com/downloads) |
| Node.js | 20 (recomendado 22) | [nodejs.org](https://nodejs.org) o `nvm install 22` |
| GitHub CLI (`gh`) | 2.40 | [cli.github.com](https://cli.github.com), luego `gh auth login` |
| Claude Code | La más reciente | Ver abajo |

Para instalar Claude Code:

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex
```

Luego abre `claude` en una terminal, escribe `/login` y sigue el flujo en el navegador. Documentación: [code.claude.com/docs](https://code.claude.com/docs).

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

Ahí vas a construir tu producto durante todo el programa y ahí vas a entregar cada estación.

```bash
gh repo create ai4dev-<tu-usuario> --private --clone --add-readme
cd ai4dev-<tu-usuario>
mkdir nivelacion
cp <ruta-a-este-repo>/nivelacion1/plantilla-entrega.md nivelacion/entrega.md
```

Agrega a los mentores como colaboradores cuando te compartan sus usuarios.

## 3. Haz el diagnóstico

Abre [`diagnostico.md`](diagnostico.md) y califícate con honestidad. Este diagnóstico no cuenta para tu calificación: sirve para ubicarte en el track correcto y para que los mentores sepan dónde apoyarte.

## 4. Resuelve el reto práctico

Está al final de [`diagnostico.md`](diagnostico.md). Hazlo dentro de tu repo personal, con Claude Code, en una carpeta `nivelacion/reto/`. Máximo 45 minutos: si no terminas, entrega lo que tengas y anota dónde te atoraste.

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
- La Nivelación 2 usa Claude Code, que ya dejaste instalado.
- Tu repo personal es donde vas a guardar el Product Vision Board de la Estación 1 y, en la semana 3, tu walking skeleton.
- El track que te toque decide qué retos opcionales te sugerimos en cada estación.

## Track avanzado
Si tu diagnóstico te ubica en el track avanzado, agrega a tu reto un `CLAUDE.md` con las convenciones de tu repo y un hook que corra los tests después de cada edición del agente. Anota si cambió la calidad del resultado.

## Si tu diagnóstico mostró huecos

| Área | Empieza por |
|---|---|
| Git y pull requests | [Pro Git, capítulos 2 y 3](https://git-scm.com/book/es/v2) y [GitHub Skills](https://skills.github.com) |
| TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Tests | [Guía de Vitest](https://vitest.dev/guide/) |
| APIs HTTP | [MDN: visión general de HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Overview) |
| Docker | [Docker: Get started](https://docs.docker.com/get-started/) |
| LLMs y agentes | [Documentación de Claude Code](https://code.claude.com/docs) y la [introducción a MCP](https://modelcontextprotocol.io/introduction) |

Puedes llevar tus dudas a la sesión de refuerzo de la semana o al grupo de la cohorte.

## Recursos
Enlaces revisados el 31 de octubre de 2026. Las versiones fijadas para toda la cohorte están en [`versions.md`](../versions.md).
