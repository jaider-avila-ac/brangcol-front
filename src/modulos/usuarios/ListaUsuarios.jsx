import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Selector from '../../components/ui/Selector'
import { usuariosApi } from './api'
import { opcionesDeRoles, useRoles } from './useRoles'

const FECHA = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

export default function ListaUsuarios({ puedeGestionar }) {
  const consultas = useQueryClient()
  const usuarios = useQuery({ queryKey: ['usuarios'], queryFn: usuariosApi.listar })
  const roles = useRoles()
  const refrescar = () => consultas.invalidateQueries({ queryKey: ['usuarios'] })
  const cambiarRol = useMutation({ mutationFn: (datos) => usuariosApi.cambiarRol(datos.codigo, datos.rol), onSuccess: refrescar })
  const cambiarEstado = useMutation({
    mutationFn: (datos) => usuariosApi.cambiarEstado(datos.codigo, datos.activo),
    onSuccess: refrescar,
  })

  if (usuarios.isPending) {
    return <Cargando />
  }
  const error = usuarios.error || cambiarRol.error || cambiarEstado.error

  return (
    <div className="flex flex-col gap-3">
      {error && <Alerta>{error.message}</Alerta>}
      <div className="overflow-x-auto border border-borde bg-superficie">
        <table className="w-full text-sm">
          <thead className="bg-superficie-alt text-left text-suave">
            <tr>
              <th className="px-3 py-2 font-medium">Nombre</th>
              <th className="px-3 py-2 font-medium">Rol</th>
              <th className="px-3 py-2 font-medium">Último ingreso</th>
              <th className="px-3 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {(usuarios.data || []).map((usuario) => {
              const editable = puedeGestionar && !usuario.esYo && !usuario.esPropietario
              return (
                <tr key={usuario.codigo} className={usuario.activo ? '' : 'text-suave'}>
                  <td className="px-3 py-2">
                    <p className="font-medium">
                      {[usuario.nombres, usuario.apellidos].filter(Boolean).join(' ')}
                      {usuario.esYo && <span className="ml-2 text-xs text-suave">(usted)</span>}
                    </p>
                    <p className="text-xs text-suave">{usuario.correo}</p>
                  </td>
                  <td className="px-3 py-2">
                    {editable && usuario.activo ? (
                      <Selector
                        id={'rol-' + usuario.codigo}
                        value={usuario.rol.codigo}
                        opciones={opcionesDeRoles(roles.data)}
                        disabled={cambiarRol.isPending}
                        onChange={(evento) => cambiarRol.mutate({ codigo: usuario.codigo, rol: evento.target.value })}
                      />
                    ) : (
                      <span>
                        {usuario.rol.nombre}
                        {usuario.esPropietario && <span className="ml-2 bg-marca px-1.5 py-0.5 text-xs text-sobre-marca">Principal</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{usuario.ultimoIngreso ? FECHA.format(new Date(usuario.ultimoIngreso)) : 'Nunca'}</td>
                  <td className="px-3 py-2">
                    {editable ? (
                      <button
                        type="button"
                        disabled={cambiarEstado.isPending}
                        onClick={() => cambiarEstado.mutate({ codigo: usuario.codigo, activo: !usuario.activo })}
                        className={'border px-2 py-1 text-xs ' + (usuario.activo ? 'border-borde hover:bg-superficie-alt' : 'border-marca text-marca hover:bg-superficie-alt')}
                      >
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    ) : (
                      <span>{usuario.activo ? 'Activo' : 'Inactivo'}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
