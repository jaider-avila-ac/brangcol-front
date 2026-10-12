import { useState } from 'react'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { useRoles } from './useRoles'

export default function Roles() {
  const roles = useRoles()
  const [abierto, setAbierto] = useState(null)

  if (roles.isPending) {
    return <Cargando />
  }
  if (roles.isError) {
    return <Alerta>{roles.error.message}</Alerta>
  }

  return (
    <ul className="divide-y divide-borde border border-borde bg-white">
      {roles.data.map((rol) => (
        <li key={rol.codigo}>
          <button
            type="button"
            onClick={() => setAbierto(abierto === rol.codigo ? null : rol.codigo)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-fondo"
          >
            <i className="bi bi-shield-check text-lg text-marca" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{rol.nombre}</span>
              <span className="block text-xs text-suave">{rol.descripcion}</span>
            </span>
            <span className="text-xs text-suave">{rol.permisos.length} permisos</span>
            <i className={'bi text-suave ' + (abierto === rol.codigo ? 'bi-chevron-up' : 'bi-chevron-down')} />
          </button>
          {abierto === rol.codigo && (
            <ul className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-borde bg-fondo px-4 py-3 text-sm md:grid-cols-2">
              {rol.permisos.map((permiso) => (
                <li key={permiso.codigo} className="flex items-start gap-2">
                  <i className="bi bi-check2 text-exito" />
                  {permiso.descripcion}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
