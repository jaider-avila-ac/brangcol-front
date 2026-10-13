import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Paginacion from '../../components/ui/Paginacion'
import { fecha } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { inventarioApi } from './api'
import { CLASES, ESTADOS } from './textos'

export default function Ajustes() {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const [pagina, setPagina] = useState(0)
  const ajustes = useQuery({
    queryKey: ['ajustes', pagina],
    queryFn: () => inventarioApi.ajustes(pagina),
    placeholderData: keepPreviousData,
  })
  const ajusta = tienePermiso(sesion, 'inventario:ajuste:gestionar')

  if (ajustes.isPending) {
    return <Cargando />
  }
  if (ajustes.isError) {
    return <Alerta>{ajustes.error.message}</Alerta>
  }
  return (
    <div className="flex flex-col gap-3">
      {ajusta && (
        <div className="flex flex-wrap justify-end gap-2">
          <Link to="/inventario/ajustes/nuevo?clase=INICIAL" className="flex items-center gap-2 border border-borde bg-superficie px-3 py-2 text-sm hover:bg-superficie-alt">
            <i className="bi bi-box-arrow-in-down" />
            Inventario inicial
          </Link>
          <Link to="/inventario/ajustes/nuevo" className="flex items-center gap-2 bg-marca px-3 py-2 text-sm text-sobre-marca hover:bg-marca-hover">
            <i className="bi bi-plus-lg" />
            Entrada o salida
          </Link>
        </div>
      )}
      <div className="overflow-x-auto border border-borde bg-superficie">
        <table className="w-full text-sm">
          <thead className="bg-superficie-alt text-left text-suave">
            <tr>
              <th className="px-3 py-2 font-medium">Número</th>
              <th className="px-3 py-2 font-medium">Qué fue</th>
              <th className="hidden px-3 py-2 font-medium md:table-cell">Motivo</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Bodega</th>
              <th className="px-3 py-2 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {ajustes.data.content.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-8 text-center text-suave">
                  Todavía no hay entradas ni salidas
                </td>
              </tr>
            )}
            {ajustes.data.content.map((a) => (
              <tr key={a.codigo} onClick={() => navegar('/inventario/ajustes/' + a.codigo)} className={'cursor-pointer hover:bg-superficie-alt ' + (a.estado === 'ANULADO' ? 'text-suave line-through' : '')}>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{a.numero}</td>
                <td className="px-3 py-2">
                  {CLASES[a.clase]}
                  {a.estado === 'ANULADO' && <span className="ml-2 text-xs">({ESTADOS.ANULADO.toLowerCase()})</span>}
                </td>
                <td className="hidden max-w-xs truncate px-3 py-2 md:table-cell">{a.motivo}</td>
                <td className="hidden px-3 py-2 sm:table-cell">{a.bodega}</td>
                <td className="px-3 py-2 whitespace-nowrap">{fecha(a.fecha)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion pagina={ajustes.data.page} totalPaginas={ajustes.data.totalPages} total={ajustes.data.totalElements} onCambiar={setPagina} />
    </div>
  )
}
