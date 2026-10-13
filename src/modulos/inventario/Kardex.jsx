import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Paginacion from '../../components/ui/Paginacion'
import { cantidad, fechaHora, pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { productosApi } from '../productos/api'
import { inventarioApi } from './api'
import Minimo from './Minimo'
import { useBodegas } from './useBodegas'

// Historia de un producto: cada entrada y salida con el saldo que quedo
export default function Kardex() {
  const { item } = useParams()
  const { data: sesion } = useSesion()
  const bodegas = useBodegas()
  const [bodega, setBodega] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [pagina, setPagina] = useState(0)
  const producto = useQuery({ queryKey: ['producto', item], queryFn: () => productosApi.obtener(item) })
  const filtro = { bodega, desde, hasta, pagina }
  const movimientos = useQuery({
    queryKey: ['kardex', item, filtro],
    queryFn: () => inventarioApi.kardex(item, filtro),
    placeholderData: keepPreviousData,
  })
  const clase = 'border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca'

  return (
    <div className="flex flex-col gap-4">
      <Link to="/inventario" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>
      {producto.data && (
        <p className="text-lg font-semibold">
          {producto.data.nombre} <span className="text-sm font-normal text-suave">{producto.data.sku}</span>
        </p>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <select value={bodega} onChange={(e) => { setBodega(e.target.value); setPagina(0) }} className={clase}>
          <option value="">Todas las bodegas</option>
          {(bodegas.data || []).map((b) => (
            <option key={b.codigo} value={b.codigo}>
              {b.nombre}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          Desde
          <input type="date" value={desde} onChange={(e) => { setDesde(e.target.value); setPagina(0) }} className={clase} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          Hasta
          <input type="date" value={hasta} onChange={(e) => { setHasta(e.target.value); setPagina(0) }} className={clase} />
        </label>
      </div>

      {bodega && tienePermiso(sesion, 'inventario:ajuste:gestionar') && <Minimo key={bodega} bodega={bodega} item={item} />}

      {movimientos.isError && <Alerta>{movimientos.error.message}</Alerta>}
      {movimientos.isPending ? (
        <Cargando />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto border border-borde bg-superficie">
            <table className="w-full text-sm">
              <thead className="bg-superficie-alt text-left text-suave">
                <tr>
                  <th className="px-3 py-2 font-medium">Fecha</th>
                  <th className="px-3 py-2 font-medium">Movimiento</th>
                  <th className="hidden px-3 py-2 font-medium lg:table-cell">Bodega</th>
                  <th className="px-3 py-2 text-right font-medium">Entró</th>
                  <th className="px-3 py-2 text-right font-medium">Salió</th>
                  <th className="px-3 py-2 text-right font-medium">Quedó</th>
                  <th className="hidden px-3 py-2 text-right font-medium md:table-cell">Costo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {movimientos.data.content.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-3 py-8 text-center text-suave">
                      Este producto todavía no tiene movimientos
                    </td>
                  </tr>
                )}
                {movimientos.data.content.map((m, indice) => (
                  <tr key={indice}>
                    <td className="px-3 py-2 whitespace-nowrap">{fechaHora(m.fecha)}</td>
                    <td className="px-3 py-2">
                      <p>{m.tipoNombre}</p>
                      <p className="text-xs text-suave">{m.documento}</p>
                    </td>
                    <td className="hidden px-3 py-2 lg:table-cell">{m.bodega}</td>
                    <td className="px-3 py-2 text-right">{m.entrada === null ? '' : cantidad(m.entrada)}</td>
                    <td className="px-3 py-2 text-right">{m.salida === null ? '' : cantidad(m.salida)}</td>
                    <td className="px-3 py-2 text-right font-medium">{cantidad(m.saldo)}</td>
                    <td className="hidden px-3 py-2 text-right md:table-cell">{pesos(m.costoUnitario)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginacion pagina={movimientos.data.page} totalPaginas={movimientos.data.totalPages} total={movimientos.data.totalElements} onCambiar={setPagina} />
        </div>
      )}
    </div>
  )
}
