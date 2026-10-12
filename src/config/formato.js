const PESOS = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export function pesos(valor) {
  return PESOS.format(Number(valor || 0))
}
