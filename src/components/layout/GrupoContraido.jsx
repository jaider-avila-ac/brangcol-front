import { NavLink, useLocation } from 'react-router'

function grupoActivo(grupo, ruta) {
  return grupo.items.some((item) => (item.ruta === '/' ? ruta === '/' : ruta.startsWith(item.ruta)))
}

function claseItem({ isActive }) {
  const base = 'flex items-center px-4 py-2.5 text-sm '
  if (isActive) {
    return base + 'bg-lateral-activo font-semibold text-sobre-marca'
  }
  return base + 'text-sobre-lateral hover:bg-lateral-linea'
}

function claseIcono(activo) {
  return (
    'flex h-11 w-12 items-center justify-center text-lg ' +
    (activo ? 'bg-lateral-activo text-sobre-marca' : 'text-sobre-lateral group-hover:bg-lateral-hover hover:bg-lateral-hover')
  )
}

// Con el menu contraido solo se ve el icono; al pasar el mouse se ven las opciones al lado
export default function GrupoContraido({ grupo }) {
  const { pathname } = useLocation()
  const activo = grupoActivo(grupo, pathname)

  if (grupo.items.length === 1) {
    const item = grupo.items[0]
    return (
      <div className="group relative px-2 pb-1">
        <NavLink to={item.ruta} end={item.ruta === '/'} className={claseIcono(activo)}>
          <i className={'bi ' + grupo.icono} />
        </NavLink>
        <span className="absolute top-2 left-full z-50 hidden bg-lateral-hover px-3 py-1.5 text-sm whitespace-nowrap text-sobre-lateral shadow-lg group-hover:block">
          {grupo.grupo}
        </span>
      </div>
    )
  }

  return (
    <div className="group relative px-2 pb-1">
      <div className={claseIcono(activo) + ' cursor-pointer'}>
        <i className={'bi ' + grupo.icono} />
      </div>
      <div className="absolute top-0 left-full z-50 hidden min-w-48 bg-lateral-hover py-1 shadow-xl group-hover:block">
        <p className="px-4 py-2 text-sm font-semibold text-sobre-lateral">{grupo.grupo}</p>
        {grupo.items.map((item) => (
          <NavLink key={item.ruta} to={item.ruta} className={claseItem}>
            {item.texto}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
