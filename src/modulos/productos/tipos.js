// Nombres sencillos para cada tipo de ítem
export const TIPOS = [
  { valor: 'SIMPLE', texto: 'Producto', ayuda: 'Se compra y se vende tal cual; maneja existencias' },
  { valor: 'SERVICIO', texto: 'Servicio', ayuda: 'No tiene existencias; puede gastar insumos al venderlo' },
  { valor: 'INSUMO', texto: 'Insumo', ayuda: 'Material que se gasta; no se vende solo' },
  { valor: 'COMPUESTO', texto: 'Combo o kit', ayuda: 'Se arma con otros productos en el momento de vender' },
  { valor: 'FABRICADO', texto: 'Fabricado', ayuda: 'Se produce antes con insumos y queda en existencias' },
]

export const CON_RECETA = ['SERVICIO', 'COMPUESTO', 'FABRICADO']

export function nombreTipo(valor) {
  const tipo = TIPOS.find((t) => t.valor === valor)
  return tipo ? tipo.texto : valor
}
