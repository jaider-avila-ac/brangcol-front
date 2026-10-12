import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { empresaApi } from './api'
import FormularioSede from './FormularioSede'

export default function Sedes({ puedeEditar }) {
  const sedes = useQuery({ queryKey: ['sedes'], queryFn: empresaApi.sedes })
  const [editando, setEditando] = useState(null)

  if (sedes.isPending) {
    return <Cargando />
  }
  if (sedes.isError) {
    return <Alerta>{sedes.error.message}</Alerta>
  }

  return (
    <div className="flex flex-col gap-4">
      {puedeEditar && !editando && (
        <Boton icono="bi-plus-lg" className="self-start" onClick={() => setEditando({ nueva: true })}>
          Nueva sede
        </Boton>
      )}
      {editando && <FormularioSede sede={editando.nueva ? null : editando} onCerrar={() => setEditando(null)} />}

      <div className="overflow-x-auto border border-borde bg-superficie">
        <table className="w-full text-sm">
          <thead className="bg-superficie-alt text-left text-suave">
            <tr>
              <th className="px-3 py-2 font-medium">Nombre</th>
              <th className="px-3 py-2 font-medium">Dirección</th>
              <th className="px-3 py-2 font-medium">Municipio</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              {puedeEditar && <th className="px-3 py-2" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {sedes.data.map((sede) => (
              <tr key={sede.codigo}>
                <td className="px-3 py-2">
                  {sede.nombre}
                  {sede.esPrincipal && <span className="ml-2 bg-marca px-1.5 py-0.5 text-xs text-sobre-marca">Principal</span>}
                </td>
                <td className="px-3 py-2">{sede.direccion}</td>
                <td className="px-3 py-2">{sede.municipio.nombre}</td>
                <td className="px-3 py-2">{sede.activa ? 'Activa' : 'Inactiva'}</td>
                {puedeEditar && (
                  <td className="px-3 py-2 text-right">
                    <button type="button" onClick={() => setEditando(sede)} className="text-marca hover:underline">
                      Editar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
