import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { rutaActiva } from '../../config/menu'

function grupoActivo(grupo, ruta) {
  return grupo.items.some((item) => (item.ruta === '/' ? ruta === '/' : ruta.startsWith(item.ruta)))
}

function claseEnlace(isActive) {
  const base = 'flex items-center gap-3 px-3 py-2.5 text-sm '
  if (isActive) {
    return base + 'bg-lateral-activo font-semibold text-sobre-marca'
  }
  return base + 'text-sobre-lateral hover:bg-lateral-hover'
}

export default function GrupoMenu({ grupo, onNavegar }) {
  const { pathname } = useLocation()
  const activo = grupoActivo(grupo, pathname)
  const [abierto, setAbierto] = useState(activo)

  if (grupo.items.length === 1) {
    const item = grupo.items[0]
    return (
      <div className="px-2.5 pb-1">
        <NavLink to={item.ruta} onClick={onNavegar} className={() => claseEnlace(rutaActiva(pathname) === item.ruta)}>
          <i className={'bi ' + grupo.icono + ' text-base'} />
          {grupo.grupo}
        </NavLink>
      </div>
    )
  }

  return (
    <div className="px-2.5 pb-1">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className={'flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-lateral-hover ' + (activo ? 'font-semibold text-sobre-lateral' : 'text-sobre-lateral')}
      >
        <i className={'bi ' + (abierto ? 'bi-folder2-open' : 'bi-folder2') + ' text-base'} />
        <span className="flex-1 text-left">{grupo.grupo}</span>
        <i className={'bi bi-chevron-down text-xs text-lateral-suave transition-transform ' + (abierto ? 'rotate-180' : '')} />
      </button>
      {abierto && (
        <div className="ml-4.5 border-l border-lateral-linea pl-2">
          {grupo.items.map((item) => (
            <NavLink key={item.ruta} to={item.ruta} onClick={onNavegar} className={() => claseEnlace(rutaActiva(pathname) === item.ruta)}>
              {item.texto}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
