import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Paginacion from '../../components/ui/Paginacion'
import { fecha } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { inventarioApi } from './api'
import { ESTADOS } from './textos'
import { bodegasActivas, useBodegas } from './useBodegas'

export default function Traslados() {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const bodegas = useBodegas()
  const [pagina, setPagina] = useState(0)
  const traslados = useQuery({
    queryKey: ['traslados', pagina],
    queryFn: () => inventarioApi.traslados(pagina),
    placeholderData: keepPreviousData,
  })
  const traslada = tienePermiso(sesion, 'inventario:traslado:gestionar')
  const variasBodegas = bodegasActivas(bodegas.data).length > 1

  if (traslados.isPending) {
    return <Cargando />
  }
  if (traslados.isError) {
    return <Alerta>{traslados.error.message}</Alerta>
  }
  return (
    <div className="flex flex-col gap-3">
      {traslada && !variasBodegas && <Alerta tipo="info">Para hacer traslados primero cree otra bodega en la pestaña Bodegas.</Alerta>}
      {traslada && variasBodegas && (
        <div className="flex justify-end">
          <Link to="/inventario/traslados/nuevo" className="flex items-center gap-2 bg-marca px-3 py-2 text-sm text-sobre-marca hover:bg-marca-hover">
            <i className="bi bi-plus-lg" />
            Nuevo traslado
          </Link>
        </div>
      )}
      <div className="overflow-x-auto border border-borde bg-superficie">
        <table className="w-full text-sm">
          <thead className="bg-superficie-alt text-left text-suave">
            <tr>
              <th className="px-3 py-2 font-medium">Número</th>
              <th className="px-3 py-2 font-medium">De → a</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="hidden px-3 py-2 font-medium sm:table-cell">Enviado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {traslados.data.content.length === 0 && (
              <tr>
                <td colSpan="4" className="px-3 py-8 text-center text-suave">
                  Todavía no hay traslados
                </td>
              </tr>
            )}
            {traslados.data.content.map((t) => (
              <tr key={t.codigo} onClick={() => navegar('/inventario/traslados/' + t.codigo)} className={'cursor-pointer hover:bg-superficie-alt ' + (t.estado === 'ANULADO' ? 'text-suave' : '')}>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{t.numero}</td>
                <td className="px-3 py-2">
                  {t.origen} <i className="bi bi-arrow-right text-suave" /> {t.destino}
                </td>
                <td className={'px-3 py-2 ' + (t.estado === 'ENVIADO' ? 'font-semibold text-marca' : '')}>{ESTADOS[t.estado]}</td>
                <td className="hidden px-3 py-2 whitespace-nowrap sm:table-cell">{fecha(t.enviadoEn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion pagina={traslados.data.page} totalPaginas={traslados.data.totalPages} total={traslados.data.totalElements} onCambiar={setPagina} />
    </div>
  )
}
