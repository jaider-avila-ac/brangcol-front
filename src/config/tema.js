import paleta from './paleta.json'

const CLAVE = 'brangcol-tema'

function aVariable(nombre) {
  return '--p-' + nombre.replace(/[A-Z]/g, (letra) => '-' + letra.toLowerCase())
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
  return 'claro'
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

