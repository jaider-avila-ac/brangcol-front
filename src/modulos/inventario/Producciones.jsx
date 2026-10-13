import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Paginacion from '../../components/ui/Paginacion'
import { cantidad, fecha } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { inventarioApi } from './api'
import { ESTADOS } from './textos'

export default function Producciones() {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const [pagina, setPagina] = useState(0)
  const producciones = useQuery({
    queryKey: ['producciones', pagina],
    queryFn: () => inventarioApi.producciones(pagina),
    placeholderData: keepPreviousData,
  })
  const produce = tienePermiso(sesion, 'inventario:ensamble:gestionar')

  if (producciones.isPending) {
    return <Cargando />
  }
  if (producciones.isError) {
    return <Alerta>{producciones.error.message}</Alerta>
  }
  return (
    <div className="flex flex-col gap-3">
      {produce && (
        <div className="flex justify-end">
          <Link to="/inventario/produccion/nueva" className="flex items-center gap-2 bg-marca px-3 py-2 text-sm text-sobre-marca hover:bg-marca-hover">
            <i className="bi bi-plus-lg" />
            Producir
          </Link>
        </div>
      )}
      <div className="overflow-x-auto border border-borde bg-superficie">
        <table className="w-full text-sm">
          <thead className="bg-superficie-alt text-left text-suave">
            <tr>
              <th className="px-3 py-2 font-medium">Número</th>
              <th className="px-3 py-2 font-medium">Producto</th>
              <th className="px-3 py-2 text-right font-medium">Cantidad</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {producciones.data.content.length === 0 && (
              <tr>
                <td colSpan="4" className="px-3 py-8 text-center text-suave">
                  Todavía no se ha producido nada
                </td>
              </tr>
            )}
            {producciones.data.content.map((p) => (
              <tr key={p.codigo} onClick={() => navegar('/inventario/produccion/' + p.codigo)} className={'cursor-pointer hover:bg-superficie-alt ' + (p.estado === 'ANULADA' ? 'text-suave line-through' : '')}>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{p.numero}</td>
                <td className="px-3 py-2">
                  {p.nombre}
                  {p.estado === 'ANULADA' && <span className="ml-2 text-xs">({ESTADOS.ANULADA.toLowerCase()})</span>}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {cantidad(p.cantidad)} {p.unidad}
                </td>
                <td className="hidden px-3 py-2 whitespace-nowrap sm:table-cell">{fecha(p.fecha)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion pagina={producciones.data.page} totalPaginas={producciones.data.totalPages} total={producciones.data.totalElements} onCambiar={setPagina} />
    </div>
  )
}
