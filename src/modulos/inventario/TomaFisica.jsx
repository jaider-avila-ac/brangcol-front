import { useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { useDemora } from '../../components/ui/useDemora'
import { cantidad } from '../../config/formato'
import { inventarioApi } from './api'
import SelectorBodega from './SelectorBodega'
import { useBodegas } from './useBodegas'

export default function TomaFisica() {
  const bodegas = useBodegas()
  if (bodegas.isPending) {
    return <Cargando />
  }
  const principal = (bodegas.data || []).find((b) => b.predeterminada)
  return <Conteo bodegaInicial={principal ? principal.codigo : ''} />
}

// Se anota lo que se conto; los productos sin anotar no se tocan
function Conteo({ bodegaInicial }) {
  const consultas = useQueryClient()
  const [bodega, setBodega] = useState(bodegaInicial)
  const [texto, setTexto] = useState('')
  const [contados, setContados] = useState({})
  const busqueda = useDemora(texto)
  const filtro = { texto: busqueda, bodega, tamano: 200 }
  const existencias = useQuery({
    queryKey: ['existencias', 'conteo', filtro],
    queryFn: () => inventarioApi.existencias(filtro),
    placeholderData: keepPreviousData,
    enabled: Boolean(bodega),
  })
  const anotados = Object.keys(contados).filter((item) => contados[item] !== '')
  const aplicar = useMutation({
    mutationFn: () => inventarioApi.registrarConteo({ bodega, lineas: anotados.map((item) => ({ item, cantidad: Number(contados[item]) })) }),
    onSuccess: () => {
      setContados({})
      consultas.invalidateQueries({ queryKey: ['existencias'] })
      consultas.invalidateQueries({ queryKey: ['ajustes'] })
    },
  })

  return (
    <div className="flex max-w-4xl flex-col gap-4">
      <p className="text-sm text-suave">Cuente lo que hay en la bodega y anótelo. Al aplicar, el sistema corrige las diferencias; los productos que deje en blanco no cambian.</p>
      {aplicar.isError && <Alerta>{aplicar.error.message}</Alerta>}
      {aplicar.isSuccess && (
        <Alerta tipo="exito">
          {aplicar.data.ajuste ? (
            <>
              Se corrigieron las diferencias. <Link to={'/inventario/ajustes/' + aplicar.data.ajuste} className="underline">Ver el detalle</Link>
            </>
          ) : (
            'Todo cuadra: no hubo diferencias.'
          )}
        </Alerta>
      )}

      <section className="grid grid-cols-1 gap-4 border border-borde bg-superficie p-4 md:grid-cols-2">
        <SelectorBodega id="bodega" etiqueta="Bodega" valor={bodega} onCambiar={(b) => { setBodega(b); setContados({}) }} />
        <div className="flex flex-col gap-1">
          <label htmlFor="buscar" className="text-sm font-medium">
            Buscar
          </label>
          <input id="buscar" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Nombre, código o código de barras" className="border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca" />
        </div>
      </section>

      {existencias.isPending ? (
        <Cargando />
      ) : (
        existencias.data && (
          <div className="overflow-x-auto border border-borde bg-superficie">
            <table className="w-full text-sm">
              <thead className="bg-superficie-alt text-left text-suave">
                <tr>
                  <th className="px-3 py-2 font-medium">Producto</th>
                  <th className="px-3 py-2 text-right font-medium">Según el sistema</th>
                  <th className="px-3 py-2 font-medium">Contó</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {existencias.data.content.map((e) => (
                  <tr key={e.item}>
                    <td className="px-3 py-2">
                      <p>{e.nombre}</p>
                      <p className="text-xs text-suave">{e.sku}</p>
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {cantidad(e.cantidad)} {e.unidad}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step={e.permiteFraccion ? 'any' : '1'}
                        value={contados[e.item] || ''}
                        onChange={(ev) => setContados({ ...contados, [e.item]: ev.target.value })}
                        className="w-28 border border-borde bg-superficie px-2 py-1.5 text-sm outline-none focus:border-marca"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <div className="flex items-center gap-3">
        <Boton icono="bi-clipboard-check" cargando={aplicar.isPending} disabled={anotados.length === 0} onClick={() => aplicar.mutate()}>
          Aplicar conteo
        </Boton>
        <span className="text-sm text-suave">{anotados.length} productos anotados</span>
      </div>
    </div>
  )
}
