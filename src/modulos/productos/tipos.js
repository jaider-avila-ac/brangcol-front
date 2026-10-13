// Opciones al crear, como en Siigo mas el fabricado. El insumo es un producto que no se vende (tipo INSUMO por dentro).
export const TIPOS = [
  { valor: 'SIMPLE', texto: 'Producto', ayuda: 'Algo físico que se compra o se vende; lleva existencias' },
  { valor: 'SERVICIO', texto: 'Servicio', ayuda: 'Un trabajo que se cobra; puede gastar insumos' },
  { valor: 'COMPUESTO', texto: 'Combo o receta', ayuda: 'Se arma con otros productos; al vender se descuentan ellos' },
  { valor: 'FABRICADO', texto: 'Fabricado', ayuda: 'Se produce antes con insumos y queda en existencias' },
]

const NOMBRES = {
  SIMPLE: 'Producto',
  INSUMO: 'Insumo',
  SERVICIO: 'Servicio',
  COMPUESTO: 'Combo o receta',
  FABRICADO: 'Fabricado',
}

export const FILTROS_TIPO = [
  { valor: 'SIMPLE', texto: 'Productos' },
  { valor: 'INSUMO', texto: 'Insumos' },
  { valor: 'SERVICIO', texto: 'Servicios' },
  { valor: 'COMPUESTO', texto: 'Combos o recetas' },
  { valor: 'FABRICADO', texto: 'Fabricados' },
]

export const CON_RECETA = ['SERVICIO', 'COMPUESTO', 'FABRICADO']

export const FISICOS = ['SIMPLE', 'INSUMO']

export function nombreTipo(valor) {
  return NOMBRES[valor] || valor
}

// El boton de Producto queda marcado tambien para los insumos
export function tipoVisible(valor) {
  return valor === 'INSUMO' ? 'SIMPLE' : valor
}

// Los que no se pueden guardar sin indicar lo que llevan o gastan
export const RECETA_OBLIGATORIA = ['COMPUESTO', 'FABRICADO']
