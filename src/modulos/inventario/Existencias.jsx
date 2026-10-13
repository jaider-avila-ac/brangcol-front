import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Paginacion from '../../components/ui/Paginacion'
import { useDemora } from '../../components/ui/useDemora'
import { cantidad, pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { inventarioApi } from './api'
import { useBodegas } from './useBodegas'

export default function Existencias() {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const bodegas = useBodegas()
  const [texto, setTexto] = useState('')
  const [bodega, setBodega] = useState('')
  const [soloBajoMinimo, setSoloBajoMinimo] = useState(false)
  const [pagina, setPagina] = useState(0)
  const busqueda = useDemora(texto)
  const filtro = { texto: busqueda, bodega, soloBajoMinimo, pagina }
  const existencias = useQuery({
    queryKey: ['existencias', filtro],
    queryFn: () => inventarioApi.existencias(filtro),
    placeholderData: keepPreviousData,
  })
  const resumen = useQuery({ queryKey: ['existencias', 'resumen'], queryFn: inventarioApi.resumen })
  const ajusta = tienePermiso(sesion, 'inventario:ajuste:gestionar')
  const cuenta = tienePermiso(sesion, 'inventario:conteo:gestionar')
  const claseFiltro = 'border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca'

  return (
    <div className="flex flex-col gap-4">
      {resumen.data && (
        <p className="text-sm text-suave">
          Valor del inventario: <strong className="text-texto">{pesos(resumen.data.valorTotal)}</strong> · {resumen.data.productos} productos
          {resumen.data.bajoMinimo > 0 && (
            <>
              {' · '}
              <button type="button" onClick={() => { setSoloBajoMinimo(true); setPagina(0) }} className="text-marca hover:underline">
                {resumen.data.bajoMinimo} por acabarse
              </button>
            </>
          )}
        </p>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
          <input
            value={texto}
            onChange={(evento) => { setTexto(evento.target.value); setPagina(0) }}
            placeholder="Buscar por nombre, código o código de barras"
            className="w-full border border-borde bg-superficie py-2 pr-3 pl-9 text-sm outline-none focus:border-marca"
          />
        </div>
        <select value={bodega} onChange={(evento) => { setBodega(evento.target.value); setPagina(0) }} className={claseFiltro}>
          <option value="">Todas las bodegas</option>
          {(bodegas.data || []).map((b) => (
            <option key={b.codigo} value={b.codigo}>
              {b.nombre}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={soloBajoMinimo} onChange={(evento) => { setSoloBajoMinimo(evento.target.checked); setPagina(0) }} className="accent-marca" />
          Por acabarse
        </label>
        <div className="flex flex-wrap gap-2">
          {cuenta && (
            <Link to="/inventario/conteo" className="flex items-center gap-2 border border-borde bg-superficie px-3 py-2 text-sm hover:bg-superficie-alt">
              <i className="bi bi-clipboard-check" />
              Contar
            </Link>
          )}
          {ajusta && (
            <Link to="/inventario/ajustes/nuevo" className="flex items-center gap-2 bg-marca px-3 py-2 text-sm text-sobre-marca hover:bg-marca-hover">
              <i className="bi bi-plus-lg" />
              Entrada o salida
            </Link>
          )}
        </div>
      </div>

      {existencias.isError && <Alerta>{existencias.error.message}</Alerta>}
      {existencias.isPending ? (
        <Cargando />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto border border-borde bg-superficie">
            <table className="w-full text-sm">
              <thead className="bg-superficie-alt text-left text-suave">
                <tr>
                  <th className="px-3 py-2 font-medium">Producto</th>
                  <th className="px-3 py-2 text-right font-medium">Tiene</th>
                  <th className="hidden px-3 py-2 text-right font-medium md:table-cell">Mínimo</th>
                  <th className="hidden px-3 py-2 text-right font-medium md:table-cell">Costo promedio</th>
                  <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {existencias.data.content.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-8 text-center text-suave">
                      No hay productos que manejen existencias
                    </td>
                  </tr>
                )}
                {existencias.data.content.map((e) => {
                  const porAcabarse = e.minimo !== null && Number(e.cantidad) <= Number(e.minimo)
                  return (
                    <tr key={e.item} onClick={() => navegar('/inventario/kardex/' + e.item)} className="cursor-pointer hover:bg-superficie-alt" title="Ver movimientos">
                      <td className="px-3 py-2">
                        <p className="font-medium">{e.nombre}</p>
                        <p className="text-xs text-suave">{e.sku}</p>
                      </td>
                      <td className={'px-3 py-2 text-right whitespace-nowrap ' + (porAcabarse ? 'font-semibold text-marca' : '')}>
                        {porAcabarse && <i className="bi bi-exclamation-circle mr-1" />}
                        {cantidad(e.cantidad)} {e.unidad}
                      </td>
                      <td className="hidden px-3 py-2 text-right text-suave md:table-cell">{e.minimo === null ? '—' : cantidad(e.minimo)}</td>
                      <td className="hidden px-3 py-2 text-right md:table-cell">{pesos(e.costoPromedio)}</td>
                      <td className="hidden px-3 py-2 text-right sm:table-cell">{pesos(e.valor)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Paginacion pagina={existencias.data.page} totalPaginas={existencias.data.totalPages} total={existencias.data.totalElements} onCambiar={setPagina} />
        </div>
      )}
    </div>
  )
}
