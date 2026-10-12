import { useLocation } from 'react-router'
import { ubicacion } from '../../config/menu'
import BotonTema from './BotonTema'
import Notificaciones from './Notificaciones'
import UsuarioBarra from './UsuarioBarra'

export default function BarraSuperior({ contraido, onMenu }) {
  const { pathname } = useLocation()
  const actual = ubicacion(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-borde bg-superficie px-3 md:px-5">
      <button
        type="button"
        onClick={onMenu}
        title={contraido ? 'Mostrar menú' : 'Ocultar menú'}
        className="flex h-10 w-10 items-center justify-center text-xl text-texto hover:bg-superficie-alt"
        aria-label="Menú"
      >
        <i className="bi bi-list" />
      </button>

      <p className="min-w-0 flex-1 truncate text-lg font-semibold text-texto">{actual ? actual.texto : ''}</p>

      <BotonTema />
      <Notificaciones />
      <div className="mx-1 h-8 w-px bg-borde" />
      <UsuarioBarra />
    </header>
  )
}
