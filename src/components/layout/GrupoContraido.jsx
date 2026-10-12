import { NavLink, useLocation } from 'react-router'

function grupoActivo(grupo, ruta) {
  return grupo.items.some((item) => (item.ruta === '/' ? ruta === '/' : ruta.startsWith(item.ruta)))
}

function claseItem({ isActive }) {
  const base = 'flex items-center gap-2.5 px-3 py-2 text-[13px] '
  if (isActive) {
    return base + 'bg-acento font-semibold text-sobre-acento'
  }
  return base + 'text-lateral-suave hover:bg-lateral-linea hover:text-sobre-lateral'
}

// Con el menu contraido solo se ve el icono; al pasar el mouse se despliegan las opciones al lado
export default function GrupoContraido({ grupo }) {
  const { pathname } = useLocation()
  const activo = grupoActivo(grupo, pathname)

  return (
    <div className="group relative px-2 pb-1">
      <div
        className={
          'flex h-11 w-12 cursor-pointer items-center justify-center text-lg ' +
          (activo ? 'bg-acento text-sobre-acento' : 'text-lateral-suave group-hover:bg-lateral-hover group-hover:text-sobre-lateral')
        }
      >
        <i className={'bi ' + grupo.icono} />
      </div>
      <div className="absolute top-0 left-full z-50 hidden min-w-52 border border-lateral-linea bg-lateral-hover py-1 shadow-xl group-hover:block">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sobre-lateral">{grupo.grupo}</p>
        {grupo.items.map((item) => (
          <NavLink key={item.ruta} to={item.ruta} end={item.ruta === '/'} className={claseItem}>
            <i className={'bi ' + item.icono} />
            {item.texto}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
