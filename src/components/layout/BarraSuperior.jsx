import { useLocation } from 'react-router'
import { ubicacion } from '../../config/menu'
import BotonTema from './BotonTema'
import Notificaciones from './Notificaciones'
import UsuarioBarra from './UsuarioBarra'

export default function BarraSuperior({ onMenu }) {
  const { pathname } = useLocation()
  const actual = ubicacion(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-borde bg-superficie px-4 md:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center text-texto hover:bg-superficie-alt md:hidden"
        aria-label="Abrir menú"
      >
        <i className="bi bi-list text-2xl" />
      </button>

      {actual && (
        <div className="min-w-0 flex-1">
          <p className="hidden text-xs uppercase tracking-wider text-suave sm:block">{actual.grupo}</p>
          <p className="truncate font-semibold text-texto">{actual.texto}</p>
        </div>
      )}
      {!actual && <div className="flex-1" />}

      <div className="flex items-center gap-1">
        <BotonTema />
        <Notificaciones />
      </div>
      <div className="h-8 w-px bg-borde" />
      <UsuarioBarra />
    </header>
  )
}
