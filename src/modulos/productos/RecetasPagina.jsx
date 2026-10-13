import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Titulo from '../../components/ui/Titulo'
import { useDemora } from '../../components/ui/useDemora'
import { pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { productosApi } from './api'
import { nombreTipo } from './tipos'

// Donde se arman los combos y los servicios: lo que lleva cada uno y cuanto cuesta
export default function RecetasPagina() {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const [texto, setTexto] = useState('')
  const busqueda = useDemora(texto)
  const recetas = useQuery({
    queryKey: ['recetas', busqueda],
    queryFn: () => productosApi.recetas(busqueda),
    placeholderData: keepPreviousData,
  })
  const puedeGestionar = tienePermiso(sesion, 'productos:item:gestionar')

  return (
    <>
      <Titulo>Lo que lleva cada combo, servicio y fabricado. El sistema lo descuenta del inventario al vender o al producir.</Titulo>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
          <input
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            placeholder="Buscar por nombre"
            className="w-full border border-borde bg-superficie py-2 pr-3 pl-9 text-sm outline-none focus:border-marca"
          />
        </div>
        {puedeGestionar && (
          <div className="flex gap-2">
            <Link to="/productos/nuevo?tipo=FABRICADO" className="flex items-center gap-2 border border-borde bg-superficie px-3 py-2 text-sm hover:bg-superficie-alt">
              <i className="bi bi-plus-lg" />
              Fabricado
            </Link>
            <Link to="/productos/nuevo?tipo=SERVICIO" className="flex items-center gap-2 border border-borde bg-superficie px-3 py-2 text-sm hover:bg-superficie-alt">
              <i className="bi bi-plus-lg" />
              Servicio
            </Link>
            <Link to="/productos/nuevo?tipo=COMPUESTO" className="flex items-center gap-2 bg-marca px-3 py-2 text-sm text-sobre-marca hover:bg-marca-hover">
              <i className="bi bi-plus-lg" />
              Combo o receta
            </Link>
          </div>
        )}
      </div>

      {recetas.isError && <Alerta>{recetas.error.message}</Alerta>}
      {recetas.isPending ? (
        <Cargando />
      ) : (
        <div className="overflow-x-auto border border-borde bg-superficie">
          <table className="w-full text-sm">
            <thead className="bg-superficie-alt text-left text-suave">
              <tr>
                <th className="px-3 py-2 font-medium">Nombre</th>
                <th className="px-3 py-2 font-medium">Lleva</th>
                <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">Costo</th>
                <th className="hidden px-3 py-2 text-right font-medium md:table-cell">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {recetas.data.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-3 py-8 text-center text-suave">
                    Todavía no hay combos, servicios ni fabricados
                  </td>
                </tr>
              )}
              {recetas.data.map((r) => (
                <tr key={r.codigo} onClick={() => navegar('/productos/' + r.codigo)} className="cursor-pointer hover:bg-superficie-alt">
                  <td className="px-3 py-2">
                    <p className="font-medium">{r.nombre}</p>
                    <p className="text-xs text-suave">
                      {nombreTipo(r.tipo)} · {r.sku}
                    </p>
                  </td>
                  <td className="px-3 py-2">
                    {r.cantidadComponentes === 0 ? (
                      <span className={r.tipo === 'SERVICIO' ? 'text-suave' : 'font-semibold text-marca'}>
                        {r.tipo === 'SERVICIO' ? 'No gasta insumos' : r.tipo === 'FABRICADO' ? 'Falta indicar lo que gasta' : 'Falta indicar lo que lleva'}
                      </span>
                    ) : (
                      r.componentes
                    )}
                  </td>
                  <td className="hidden px-3 py-2 text-right whitespace-nowrap sm:table-cell">{pesos(r.costo)}</td>
                  <td className="hidden px-3 py-2 text-right whitespace-nowrap md:table-cell">{pesos(r.precioConImpuesto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
