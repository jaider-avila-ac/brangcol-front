import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import Imagen from '../../components/ui/Imagen'
import Paginacion from '../../components/ui/Paginacion'
import Titulo from '../../components/ui/Titulo'
import { useDemora } from '../../components/ui/useDemora'
import { pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { productosApi } from './api'
import { nombreTipo, TIPOS } from './tipos'
import { useCategorias } from './useCatalogosProducto'

export default function ProductosPagina() {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const categorias = useCategorias()
  const [texto, setTexto] = useState('')
  const [tipo, setTipo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pagina, setPagina] = useState(0)
  const busqueda = useDemora(texto)
  const filtro = { texto: busqueda, tipo, categoria, pagina }
  const productos = useQuery({
    queryKey: ['productos', filtro],
    queryFn: () => productosApi.buscar(filtro),
    placeholderData: keepPreviousData,
  })
  const puedeGestionar = tienePermiso(sesion, 'productos:item:gestionar')
  const claseFiltro = 'border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca'

  return (
    <>
      <Titulo>Lo que vende, los servicios que presta y los insumos que usa</Titulo>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
          <input
            value={texto}
            onChange={(evento) => {
              setTexto(evento.target.value)
              setPagina(0)
            }}
            placeholder="Buscar por nombre, código o código de barras"
            className="w-full border border-borde bg-superficie py-2 pr-3 pl-9 text-sm outline-none focus:border-marca"
          />
        </div>
        <select value={tipo} onChange={(evento) => { setTipo(evento.target.value); setPagina(0) }} className={claseFiltro}>
          <option value="">Todos los tipos</option>
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.texto}
            </option>
          ))}
        </select>
        <select value={categoria} onChange={(evento) => { setCategoria(evento.target.value); setPagina(0) }} className={claseFiltro}>
          <option value="">Todas las categorías</option>
          {(categorias.data || []).map((c) => (
            <option key={c.codigo} value={c.codigo}>
              {c.padreNombre ? c.padreNombre + ' / ' + c.nombre : c.nombre}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Link to="/productos/categorias" className="flex items-center gap-2 border border-borde bg-superficie px-3 py-2 text-sm hover:bg-superficie-alt">
            <i className="bi bi-tags" />
            Categorías y marcas
          </Link>
          {puedeGestionar && (
            <Link to="/productos/nuevo" className="flex items-center gap-2 bg-marca px-3 py-2 text-sm text-sobre-marca hover:bg-marca-hover">
              <i className="bi bi-plus-lg" />
              Nuevo
            </Link>
          )}
        </div>
      </div>

      {productos.isError && <Alerta>{productos.error.message}</Alerta>}
      {productos.isPending ? (
        <Cargando />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="overflow-x-auto border border-borde bg-superficie">
            <table className="w-full text-sm">
              <thead className="bg-superficie-alt text-left text-suave">
                <tr>
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">Tipo</th>
                  <th className="hidden px-3 py-2 font-medium md:table-cell">Categoría</th>
                  <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {productos.data.content.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-3 py-8 text-center text-suave">
                      No hay productos todavía
                    </td>
                  </tr>
                )}
                {productos.data.content.map((p) => (
                  <tr key={p.codigo} onClick={() => navegar('/productos/' + p.codigo)} className={'cursor-pointer hover:bg-superficie-alt ' + (p.activo ? '' : 'text-suave')}>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <Imagen codigo={p.foto} alt={p.nombre} />
                        <div>
                          <p className="font-medium">{p.nombre}</p>
                          <p className="text-xs text-suave">
                            {p.sku}
                            {!p.activo && ' · inactivo'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-2 sm:table-cell">{nombreTipo(p.tipo)}</td>
                    <td className="hidden px-3 py-2 md:table-cell">{p.categoria || '—'}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {p.tipo === 'INSUMO' ? '—' : pesos(p.precioConImpuesto) + ' / ' + p.unidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginacion pagina={productos.data.page} totalPaginas={productos.data.totalPages} total={productos.data.totalElements} onCambiar={setPagina} />
        </div>
      )}
    </>
  )
}
