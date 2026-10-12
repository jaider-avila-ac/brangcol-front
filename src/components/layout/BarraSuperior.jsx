import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import { authApi } from '../../modulos/auth/api'
import { useSesion } from '../../modulos/auth/useSesion'

export default function BarraSuperior({ onMenu }) {
  const { data: sesion } = useSesion()
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  const consultas = useQueryClient()
  const navegar = useNavigate()

  useEffect(() => {
    function alHacerClic(evento) {
      if (contenedor.current && !contenedor.current.contains(evento.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', alHacerClic)
    return () => document.removeEventListener('mousedown', alHacerClic)
  }, [])

  async function salir() {
    try {
      await authApi.salir()
    } finally {
      consultas.clear()
      navegar('/login', { replace: true })
    }
  }

  const nombre = sesion ? sesion.persona.nombres : ''
  const empresa = sesion ? sesion.empresa.nombreComercial || sesion.empresa.razonSocial : ''

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 bg-marca px-4 text-white">
      <button
        type="button"
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center hover:bg-marca-oscuro md:hidden"
        aria-label="Abrir menú"
      >
        <i className="bi bi-list text-2xl" />
      </button>
      <span className="text-lg font-semibold tracking-wide">BrangCol</span>
      <span className="hidden truncate border-l border-white/30 pl-3 text-sm text-marca-claro sm:inline">{empresa}</span>

      <div className="relative ml-auto" ref={contenedor}>
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-marca-oscuro"
        >
          <i className="bi bi-person-circle text-xl" />
          <span className="hidden max-w-40 truncate sm:inline">{nombre}</span>
          <i className="bi bi-chevron-down text-xs" />
        </button>
        {abierto && (
          <div className="absolute right-0 z-40 mt-1 w-52 border border-borde bg-white text-sm text-texto shadow-md">
            <Link to="/mi-cuenta" onClick={() => setAbierto(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-fondo">
              <i className="bi bi-person" />
              Mi cuenta
            </Link>
            <button type="button" onClick={salir} className="flex w-full items-center gap-2 border-t border-borde px-4 py-2.5 text-left hover:bg-fondo">
              <i className="bi bi-box-arrow-right" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
