import { NavLink } from 'react-router'
import { menu } from '../../config/menu'

function claseEnlace({ isActive }) {
  const base = 'flex items-center gap-3 border-l-4 px-4 py-2.5 text-sm'
  if (isActive) {
    return base + ' border-acento bg-marca-claro font-semibold text-marca'
  }
  return base + ' border-transparent text-texto hover:bg-fondo'
}

export default function MenuLateral({ abierto, onCerrar }) {
  const posicion = abierto ? 'translate-x-0' : '-translate-x-full'

  return (
    <>
      {abierto && (
        <div className="fixed inset-0 top-14 z-20 bg-black/40 md:hidden" onClick={onCerrar} />
      )}
      <nav
        className={
          'fixed top-14 bottom-0 left-0 z-30 w-64 overflow-y-auto border-r border-borde bg-white transition-transform ' +
          'md:static md:translate-x-0 ' +
          posicion
        }
      >
        <ul className="py-2">
          {menu.map((item) => (
            <li key={item.ruta}>
              <NavLink to={item.ruta} end={item.ruta === '/'} className={claseEnlace} onClick={onCerrar}>
                <i className={'bi ' + item.icono + ' text-base'} />
                {item.texto}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
