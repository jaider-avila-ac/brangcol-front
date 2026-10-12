import { useState } from 'react'
import { Outlet } from 'react-router'
import BarraSuperior from './BarraSuperior'
import MenuLateral from './MenuLateral'

const CLAVE_CONTRAIDO = 'brangcol-menu-contraido'

function contraidoGuardado() {
  try {
    return localStorage.getItem(CLAVE_CONTRAIDO) === 'si'
  } catch {
    return false
  }
}

export default function Layout() {
  const [contraido, setContraido] = useState(contraidoGuardado)
  const [abiertoMovil, setAbiertoMovil] = useState(false)

  function alternarContraido() {
    const nuevo = !contraido
    setContraido(nuevo)
    try {
      localStorage.setItem(CLAVE_CONTRAIDO, nuevo ? 'si' : 'no')
    } catch {
      return
    }
  }

  function alPresionarMenu() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      alternarContraido()
      return
    }
    setAbiertoMovil(true)
  }

  return (
    <div className="flex h-full">
      <MenuLateral
        contraido={contraido}
        abiertoMovil={abiertoMovil}
        onCerrarMovil={() => setAbiertoMovil(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <BarraSuperior contraido={contraido} onMenu={alPresionarMenu} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
