/** Si AGENT_ACCESS_TOKEN está definido, exige el encabezado Authorization: Bearer <token>. */
export function autorizado(request: Request): boolean {
  const tokenEsperado = process.env.AGENT_ACCESS_TOKEN;
  return !tokenEsperado || request.headers.get('authorization') === `Bearer ${tokenEsperado}`;
}
