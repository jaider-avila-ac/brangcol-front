const PESOS = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export function pesos(valor) {
  return PESOS.format(Number(valor || 0))
}

const CANTIDAD = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 4 })

export function cantidad(valor) {
  return CANTIDAD.format(Number(valor || 0))
}

const FECHA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
const FECHA_HORA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })

// Las fechas sin hora (2026-10-12) se leen como dia local, no como UTC
export function fecha(valor) {
  if (!valor) {
    return '—'
  }
  if (valor.length === 10) {
    return FECHA.format(new Date(valor + 'T00:00:00'))
  }
  return FECHA.format(new Date(valor))
}

export function fechaHora(valor) {
  return valor ? FECHA_HORA.format(new Date(valor)) : '—'
}
