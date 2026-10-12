import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Paginacion from '../../components/ui/Paginacion'
import Titulo from '../../components/ui/Titulo'
import { useDemora } from '../../components/ui/useDemora'
import { pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { tercerosApi } from './api'

const ROLES = [
  { valor: 'TODOS', texto: 'Todos' },
  { valor: 'CLIENTES', texto: 'Clientes' },
  { valor: 'PROVEEDORES', texto: 'Proveedores' },
]

function tipo(tercero) {
  if (tercero.esCliente && tercero.esProveedor) {
    return 'Cliente y proveedor'
  }
  return tercero.esCliente ? 'Cliente' : 'Proveedor'
}

export default function TercerosPagina() {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const [texto, setTexto] = useState('')
  const [rol, setRol] = useState('TODOS')
  const [soloDeben, setSoloDeben] = useState(false)
  const [pagina, setPagina] = useState(0)
  const busqueda = useDemora(texto)
  const filtro = { texto: busqueda, rol, soloDeben, pagina }
  const terceros = useQuery({
    queryKey: ['terceros', filtro],
    queryFn: () => tercerosApi.buscar(filtro),
    placeholderData: keepPreviousData,
  })

  function cambiar(accion) {
    accion()
    setPagina(0)
  }

  return (
    <>
      <Titulo>Las personas y empresas a quienes les vende o les compra</Titulo>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
          <input
            value={texto}
            onChange={(evento) => cambiar(() => setTexto(evento.target.value))}
            placeholder="Buscar por nombre, documento o teléfono"
            className="w-full border border-borde bg-superficie py-2 pr-3 pl-9 text-sm outline-none focus:border-marca"
          />
        </div>
        <div className="flex border border-borde bg-superficie">
          {ROLES.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              onClick={() => cambiar(() => setRol(opcion.valor))}
              className={'px-3 py-2 text-sm ' + (rol === opcion.valor ? 'bg-marca text-sobre-marca' : 'text-texto hover:bg-superficie-alt')}
            >
              {opcion.texto}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={soloDeben} onChange={(evento) => cambiar(() => setSoloDeben(evento.target.checked))} className="h-4 w-4 accent-marca" />
          Solo los que deben
        </label>
        <div className="flex gap-2">
          {tienePermiso(sesion, 'terceros:tercero:importar') && (
            <Link to="/terceros/importar" className="flex items-center gap-2 border border-borde bg-superficie px-3 py-2 text-sm hover:bg-superficie-alt">
              <i className="bi bi-upload" />
              Importar
            </Link>
          )}
          {tienePermiso(sesion, 'terceros:tercero:crear') && (
            <Link to="/terceros/nuevo" className="flex items-center gap-2 bg-marca px-3 py-2 text-sm text-sobre-marca hover:bg-marca-hover">
              <i className="bi bi-plus-lg" />
              Nuevo
            </Link>
          )}
        </div>
      </div>

      {terceros.isError && <Alerta>{terceros.error.message}</Alerta>}
      {terceros.isPending ? (
        <Cargando />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto border border-borde bg-superficie">
            <table className="w-full text-sm">
              <thead className="bg-superficie-alt text-left text-suave">
                <tr>
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="hidden px-3 py-2 font-medium md:table-cell">Teléfono</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">Tipo</th>
                  <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Le debe</th>
                  <th className="hidden px-3 py-2 text-right font-medium whitespace-nowrap md:table-cell">Saldo a favor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {terceros.data.content.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-8 text-center text-suave">
                      No se encontraron clientes ni proveedores
                    </td>
                  </tr>
                )}
                {terceros.data.content.map((tercero) => (
                  <tr key={tercero.codigo} onClick={() => navegar('/terceros/' + tercero.codigo)} className="cursor-pointer hover:bg-superficie-alt">
                    <td className="px-3 py-2.5">
                      <p className="font-medium">{tercero.nombre}</p>
                      <p className="text-xs text-suave">{tercero.documento || 'Sin documento'}</p>
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell">{tercero.telefono || "—"}</td>
                    <td className="hidden px-3 py-2.5 sm:table-cell">{tipo(tercero)}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">{tercero.esCliente ? pesos(tercero.debe) : "—"}</td>
                    <td className="hidden px-3 py-2.5 text-right md:table-cell">{tercero.esCliente ? pesos(tercero.saldoFavor) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginacion
            pagina={terceros.data.page}
            totalPaginas={terceros.data.totalPages}
            total={terceros.data.totalElements}
            onCambiar={setPagina}
          />
        </div>
      )}
    </>
  )
}
