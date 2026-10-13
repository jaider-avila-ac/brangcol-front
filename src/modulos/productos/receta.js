export function componentesAPeticion(filas) {
  const resultado = []
  for (const f of filas) {
    resultado.push({ item: f.item, cantidad: Number(f.cantidad), merma: Number(f.merma || 0) })
  }
  return resultado
}

export function tituloReceta(tipo) {
  return tipo === 'SERVICIO' ? 'Insumos que gasta' : 'Lo que lleva'
}

export function costoFila(f) {
  return Number(f.cantidad || 0) * (1 + Number(f.merma || 0) / 100) * Number(f.costoUnitario || 0)
}

export function filaDesdeProducto(item) {
  return { item: item.codigo, nombre: item.nombre, unidad: item.unidad, cantidad: 1, merma: 0, costoUnitario: item.costoPromedio }
}
