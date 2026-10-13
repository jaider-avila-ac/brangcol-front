// Convierte las lineas del formulario a lo que espera el servidor
export function lineasAPeticion(lineas, conCosto) {
  const resultado = []
  for (const l of lineas) {
    const linea = { item: l.item, sentido: l.sentido, cantidad: Number(l.cantidad) }
    if (conCosto && l.sentido === 'ENTRADA' && l.costo !== '') {
      linea.costo = Number(l.costo)
    }
    resultado.push(linea)
  }
  return resultado
}
