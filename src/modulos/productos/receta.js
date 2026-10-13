// Las cantidades se pueden escribir para varias unidades (100 hojas para 100 sobres);
// al servidor siempre va lo que gasta una unidad
export function componentesAPeticion(filas, rinde) {
  const unidades = Number(rinde) > 0 ? Number(rinde) : 1
  const resultado = []
  for (const f of filas) {
    const cantidad = Math.round((Number(f.cantidad) / unidades) * 10000) / 10000
    resultado.push({ item: f.item, cantidad, merma: Number(f.merma || 0) })
  }
  return resultado
}

const TITULOS = {
  SERVICIO: 'Insumos que gasta',
  COMPUESTO: 'Lo que lleva',
  FABRICADO: 'Lo que gasta al producirlo',
}

const AYUDAS = {
  SERVICIO: 'Al vender el servicio se descuentan de las existencias.',
  COMPUESTO: 'Al vender el combo se descuentan de las existencias.',
  FABRICADO: 'Al registrar una producción se descuentan y entra el producto terminado a las existencias.',
}

export function tituloReceta(tipo) {
  return TITULOS[tipo] || 'Lo que lleva'
}

export function ayudaReceta(tipo) {
  return AYUDAS[tipo] || ''
}

export function costoFila(f) {
  return Number(f.cantidad || 0) * (1 + Number(f.merma || 0) / 100) * Number(f.costoUnitario || 0)
}

export function filaDesdeProducto(item) {
  return { item: item.codigo, nombre: item.nombre, unidad: item.unidad, cantidad: 1, merma: 0, costoUnitario: item.costoPromedio }
}
