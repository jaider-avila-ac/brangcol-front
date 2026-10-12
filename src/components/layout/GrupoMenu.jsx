import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'

function grupoActivo(grupo, ruta) {
  return grupo.items.some((item) => (item.ruta === '/' ? ruta === '/' : ruta.startsWith(item.ruta)))
}

function claseItem({ isActive }) {
  const base = 'flex items-center gap-2.5 px-3 py-1.5 text-[13px] '
  if (isActive) {
    return base + 'bg-acento font-semibold text-sobre-acento'
  }
  return base + 'text-lateral-suave hover:bg-lateral-hover hover:text-sobre-lateral'
}

export default function GrupoMenu({ grupo, onNavegar }) {
  const { pathname } = useLocation()
  const activo = grupoActivo(grupo, pathname)
  const [abierto, setAbierto] = useState(true)

  return (
    <div className="px-2.5 pb-1">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className={
          'flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-lateral-hover ' +
          (activo ? 'text-sobre-lateral' : 'text-lateral-suave')
        }
      >
        <i className={'bi ' + (abierto ? 'bi-folder2-open' : 'bi-folder2') + (activo ? ' text-acento' : '')} />
        <span className="flex-1 text-left">{grupo.grupo}</span>
        {!abierto && activo && <span className="h-1.5 w-1.5 bg-acento" />}
        <i className={'bi bi-chevron-down text-xs transition-transform ' + (abierto ? 'rotate-180' : '')} />
      </button>
      {abierto && (
        <div className="mt-0.5 ml-[18px] border-l border-lateral-linea pl-2.5">
          {grupo.items.map((item) => (
            <NavLink key={item.ruta} to={item.ruta} end={item.ruta === '/'} onClick={onNavegar} className={claseItem}>
              <i className={'bi ' + item.icono} />
              {item.texto}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
