# Nivelación 1 · Guía del mentor

## En una frase
Que cada alumno llegue a la Estación 1 con el entorno funcionando, su repo creado y su track asignado. El error más común es dejar el setup para el día de la clase y perder la primera media hora.

## Preparación (antes de abrir la semana)
- [ ] Corre `bash nivelacion1/verificar-entorno.sh` en tu máquina y revisa que los enlaces del README abran
- [ ] Ten listo el formulario de la cohorte donde los alumnos comparten el enlace de su repo
- [ ] Comparte con los alumnos los usuarios de GitHub de los mentores para que los agreguen como colaboradores
- [ ] Haz tú mismo el reto práctico con Claude Code: te sirve para calibrar qué tan difícil es en 45 minutos

## Guion de la semana

Es asíncrona, así que no hay clase de 120 minutos. El trabajo del mentor se reparte así:

| Cuándo | Qué hace el mentor | Qué hacen los alumnos |
|---|---|---|
| Lunes | Anuncia la semana con el enlace al README y la fecha límite (antes de la Estación 1) | Empiezan el setup |
| Martes y miércoles | Responde dudas de instalación en el grupo de la cohorte | Setup, repo personal, diagnóstico |
| Miércoles, refuerzo | Sesión abierta para destrabar instalaciones en vivo | Traen sus errores |
| Jueves | Revisa el formulario: quién no ha compartido su repo | Reto práctico y entrega |
| Viernes | Revisa las entregas, confirma tracks y avisa a quien va atrasado | Nivelación 2 |

## Demo
No hay demo en vivo. Si alguien pide ver el reto resuelto, muestra **cómo dirigiste al agente** (tus prompts, tus correcciones y cómo verificaste) en lugar de mostrar la solución: eso es lo que evalúa el reto.

Plan B para quien no logre instalar nada: GitHub Codespaces con Node 22 y Claude Code instalado desde la terminal del Codespace. Sirve para no perder la semana mientras resuelve su máquina.

## Conceptos clave
1. **El repo personal es el hilo del programa.** Ahí van todas las entregas; si no existe, nada de lo siguiente funciona.
   Pregunta para verificar: "¿Dónde vas a guardar tu Product Vision Board de la Estación 1?"
2. **El diagnóstico es para ubicarse, no para calificar.** Si alguien se infla el puntaje, termina en un track que no le sirve.
   Pregunta: "¿Cuál es tu sección más baja y qué vas a hacer con ella esta semana?"
3. **Con un agente, verificar importa más que generar.** El reto pide notas sobre las correcciones por esa razón.
   Pregunta: "¿Cómo supiste que el código del agente estaba bien?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| `claude: command not found` después de instalar | La terminal no recargó el `PATH` | Abrir una terminal nueva o `source ~/.zshrc` / `~/.bashrc` |
| Claude Code pide pagar o no deja iniciar sesión | Cuenta de Claude sin plan Pro o Max, y sin API | Activar un plan o usar una llave de la API de Anthropic |
| El script marca Node en rojo con una versión vieja | Node instalado por el sistema operativo | Instalar `nvm` y correr `nvm install 22` |
| `gh auth` en rojo | Nunca corrió `gh auth login` | Correrlo y elegir GitHub.com con HTTPS |
| Docker no arranca en Windows | Falta WSL 2 o la virtualización está apagada | Instalar WSL 2 y activar la virtualización en la BIOS. No es obligatorio esta semana |
| El reto quedó sin tests | Pidió la función completa en un solo prompt | Sugerir que empiece pidiendo los tests y después la implementación |

## Preguntas frecuentes
- **¿Puedo usar Cursor u otro editor en lugar de Claude Code?** Puedes usar el editor que quieras, pero las demos y las guías usan Claude Code. Tenlo instalado aunque trabajes en otro lado.
- **¿Mi repo puede ser público?** Sí, pero si vas a trabajar un problema real de tu empresa, mejor privado.
- **¿Qué pasa si no termino el reto en 45 minutos?** Entrega lo que tengas y anota dónde te atoraste. Cuenta igual para ubicarte.
- **¿Necesito la llave de OpenAI ya?** No. Se usa a partir de la semana 5.

## Qué se adapta y qué no
- Fijo: herramientas obligatorias, diagnóstico de 20 afirmaciones, reto y reglas para asignar el track
- Libre: el canal de comunicación con los alumnos, los recursos extra que sugieras por área y el formato de la sesión de refuerzo

## Cierre y refuerzo
- Antes de la Estación 1: confirma en el grupo quiénes quedaron en track avanzado y recuérdales el reto opcional
- Lleva al refuerzo la lista de quienes no compartieron su repo o tienen el entorno incompleto, y contáctalos antes
- Pasa a los mentores de E1 y E2 un resumen: cuántos alumnos hay en cada track y la sección más baja del grupo

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
