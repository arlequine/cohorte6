# Estación 9 · Guía del mentor

## En una frase
El alumno sale con su infraestructura en código y un pipeline que lleva cada cambio a producción después de un `terraform plan` revisado, y entiende que en producción nada se cambia a mano. El error más común es crear recursos desde la consola de AWS "para probar" y terminar con un estado que no coincide con el código.

## Preparación (48 h antes)
- [ ] En tu cuenta de práctica, crea un repo de demo desde la solución de referencia (`repos/producto-desplegado/`), conéctalo a Vercel y deja el bootstrap aplicado y las variables de GitHub configuradas. El pipeline debe quedar en verde con un push a main
- [ ] Ten abierto un PR de ejemplo que cambie algo pequeño de la infraestructura (por ejemplo, una etiqueta en la tabla), para mostrar el plan comentado
- [ ] Levanta LocalStack con tu token y corre `bash scripts/tf-local.sh apply` para la demo en local
- [ ] Revisa en `versions.md` las versiones de Terraform y de los providers
- [ ] Revisa el semáforo: quién no tiene su walking skeleton de E3 desplegado. Sin él, la ruta C no tiene dónde aterrizar

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Archivo |
|---|---|---|---|
| 0–15 | Explica las tres rutas (A, B y C) y por qué el programa usa la C | Ubican cuál usaría su empresa | README, "Tres formas de desplegar" |
| 15–30 | `init → plan → apply`, estado e idempotencia; por qué el estado va en un bucket cifrado | Preguntan | `infra/backend.tf` |
| 30–45 | Demo: `scripts/tf-local.sh apply` en LocalStack y luego el plan de producción en el PR de ejemplo | Observan | `infra/local.tfvars`, `infra/produccion.tfvars` |
| 45–55 | OIDC: qué crea el bootstrap, la condición `sub` del rol y por qué no hay llaves en GitHub | Leen `infra/bootstrap/main.tf` | `infra/bootstrap/` |
| 55–60 | Pausa | | |
| 60–105 | Circula: primero quien no tiene el bootstrap aplicado, después quien tiene el pipeline en rojo | Pasos 1 a 7 de la tarea | README, "Tu tarea" |
| 105–115 | Demo de drift: cambia algo de la tabla desde la consola y corre `terraform plan` | Observan | — |
| 115–120 | Entregable, rúbrica y conexión con E10 | Anotan dudas | README |

## Demo
1. **Local.** Con LocalStack arriba: `bash scripts/tf-local.sh plan` y luego `apply`. Muestra que es el mismo `main.tf`; solo cambia el archivo de variables.
2. **Plan en el PR.** Abre el PR de ejemplo y muestra el comentario con el plan: qué se crea (`+`), qué cambia (`~`) y qué se destruye (`-`). Pregunta al grupo si lo aprobarían.
3. **Apply y deploy.** Fusiona el PR y sigue el pipeline: apply, después deploy a Vercel. Muestra la URL en el resumen del job.
4. **Drift.** En la consola de AWS, agrega una etiqueta a la tabla. Corre el pipeline o `terraform plan`: el plan propone quitarla. Mensaje: lo que no está en el código no existe.

Plan B si algo falla en vivo:
- LocalStack no arranca (token, Docker): salta al plan del PR, que corre en GitHub y no depende de tu máquina.
- AWS o Vercel fallan: muestra la última ejecución verde del pipeline en tu repo de demo y recorre sus pasos.

## Conceptos clave
1. **El estado es la memoria de Terraform.** Sin él, Terraform no sabe qué creó. Por eso va en un bucket privado, cifrado y con versiones, y con bloqueo para que dos ejecuciones no se pisen.
   Pregunta: "¿Qué pasaría si dos personas corren `apply` al mismo tiempo sin bloqueo?"
2. **El plan es la revisión de código de la infraestructura.** Nadie aplica sin que el plan se haya leído en un PR.
   Pregunta: "¿Qué línea del plan te haría rechazar el PR?"
3. **OIDC en lugar de llaves.** GitHub Actions recibe credenciales temporales solo para la rama main y los PR del repo.
   Pregunta: "Si alguien hace fork de tu repo, ¿puede desplegar en tu cuenta?" (No: la condición `sub` solo acepta tu repo.)
4. **Mínimo privilegio en dos niveles.** La app solo puede leer y escribir su tabla; el pipeline solo puede tocar recursos con el prefijo del proyecto.
5. **Elegir la ruta es una decisión de arquitectura.** La C no es la única correcta; depende de la empresa.

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| `Not authorized to perform sts:AssumeRoleWithWebIdentity` | `github_repo` del bootstrap no coincide con el repo, o el workflow no tiene `id-token: write` | Revisar el formato `usuario/repo` exacto y los permisos del job |
| `EntityAlreadyExists` al crear el proveedor OIDC | La cuenta de AWS ya tiene el proveedor de GitHub | En el bootstrap, `crear_proveedor_oidc = false` |
| `AccessDenied` en el apply sobre DynamoDB o IAM | El `proyecto` del bootstrap y el de `infra/` no coinciden, así que el prefijo no cuadra | Usar el mismo valor en los dos |
| El pipeline omite los jobs de infra y deploy | Falta la variable `AWS_ROLE_ARN` en GitHub | Definirla en Variables, no en Secretos |
| El provider de Vercel no encuentra el proyecto | `VERCEL_PROJECT_NAME` distinto del nombre real, o el proyecto está en un equipo y falta `VERCEL_TEAM` | Revisar el nombre en el dashboard de Vercel |
| Vercel rechaza la variable `AWS_REGION` | Vercel reserva los nombres `AWS_*` | Usar el prefijo `APP_AWS_` |
| `GET /api/historial` responde 503 en producción | El deploy se hizo antes del apply, o desde la integración de Git de Vercel | Revisar que `vercel.json` desactiva los deploys automáticos de main y que el pipeline corrió completo |
| LocalStack no levanta | Falta `LOCALSTACK_AUTH_TOKEN` o Docker no está corriendo | Exportar el token; si el uso es comercial sin licencia, saltar la prueba local |
| El alumno no usa Claude Code y su agente no tiene los MCP de Terraform | Configuración propia de su herramienta | `mcp/README.md` explica dónde configurarlos; si se atora, que haga este ejercicio en Claude Code |

## Preguntas frecuentes
- **¿Por qué no desplegamos la app en AWS?** Porque el walking skeleton ya vive en Vercel desde la semana 3 y cambiar de plataforma a mitad del curso no aporta al aprendizaje. La ruta B está documentada para quien la necesite.
- **¿Cuánto cuesta?** DynamoDB en modo bajo demanda y el bucket del estado cuestan centavos con el tráfico de práctica. La ruta B sí genera costo fijo por el balanceador y los contenedores.
- **¿Por qué la app usa llaves de IAM si el pipeline usa OIDC?** Por simplicidad en esta estación. Cambiarlas por OIDC de Vercel es un reto del track avanzado y un buen tema para E10.
- **¿Puedo usar OpenTofu en lugar de Terraform?** Sí, el código es compatible. Las guías y el pipeline usan Terraform.

## Qué se adapta y qué no
- Fijo: la ruta C como camino principal, OIDC para el pipeline, el plan revisado en el PR antes de aplicar y nada creado a mano
- Libre: la región de AWS, si se hace la prueba en LocalStack y cuánto tiempo dedicar a la ruta B según el grupo

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-9` se entrega antes de la Estación 10
- En el refuerzo, prioriza a quien tiene el pipeline en rojo: E10 agrega controles a ese mismo pipeline
- Pide que guarden el estado del bootstrap fuera del repo

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
