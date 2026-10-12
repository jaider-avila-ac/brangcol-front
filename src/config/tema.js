import paleta from './paleta.json'

const CLAVE = 'brangcol-tema'

function aVariable(nombre) {
  return '--p-' + nombre.replace(/[A-Z]/g, (letra) => '-' + letra.toLowerCase())
}

function mezclar(hexA, hexB, pesoA) {
  const a = parseInt(hexA.slice(1), 16)
  const b = parseInt(hexB.slice(1), 16)
  const canal = (desplazamiento) =>
    Math.round(((a >> desplazamiento) & 255) * pesoA + ((b >> desplazamiento) & 255) * (1 - pesoA))
  const valor = (canal(16) << 16) | (canal(8) << 8) | canal(0)
  return '#' + valor.toString(16).padStart(6, '0')
}

export function temaGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado === 'claro' || guardado === 'oscuro') {
      return guardado
    }
  } catch {
    return 'claro'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function aplicarTema(modo) {
  const raiz = document.documentElement
  const colores = paleta[modo]
  for (const nombre of Object.keys(colores)) {
    raiz.style.setProperty(aVariable(nombre), colores[nombre])
  }
  raiz.dataset.tema = modo
  raiz.style.colorScheme = modo === 'oscuro' ? 'dark' : 'light'
  try {
    localStorage.setItem(CLAVE, modo)
  } catch {
    return
  }
}

// Colores para lo que no usa CSS (graficas); los derivados siguen la misma regla que index.css
export function coloresTema(modo) {
  const base = paleta[modo]
  return {
    ...base,
    suave: mezclar(base.texto, base.superficie, 0.62),
    borde: mezclar(base.superficie, base.texto, 0.84),
  }
}
