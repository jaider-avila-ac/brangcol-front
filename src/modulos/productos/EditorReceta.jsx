import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { pesos } from '../../config/formato'
import { productosApi } from './api'
import BuscadorComponente from './BuscadorComponente'

export default function EditorReceta({ producto, editable }) {
  const consultas = useQueryClient()
  const receta = useQuery({ queryKey: ['receta', producto.codigo], queryFn: () => productosApi.receta(producto.codigo) })

  if (receta.isPending) {
    return <Cargando />
  }
  return <Contenido key={receta.dataUpdatedAt} producto={producto} receta={receta.data} editable={editable} consultas={consultas} />
}

function Contenido({ producto, receta, editable, consultas }) {
  const [filas, setFilas] = useState(receta.componentes)
  const guardar = useMutation({
    mutationFn: () => productosApi.guardarReceta(producto.codigo, filas.map((f) => ({ item: f.item, cantidad: Number(f.cantidad), merma: Number(f.merma || 0) }))),
    onSuccess: (datos) => consultas.setQueryData(['receta', producto.codigo], datos),
  })

  function cambiar(indice, campo, valor) {
    setFilas(filas.map((fila, i) => (i === indice ? { ...fila, [campo]: valor } : fila)))
  }

  function agregar(item) {
    if (!filas.some((f) => f.item === item.codigo)) {
      setFilas([...filas, { item: item.codigo, nombre: item.nombre, unidad: item.unidad, cantidad: 1, merma: 0, costoUnitario: item.costoPromedio }])
    }
  }

  const costo = filas.reduce((total, f) => total + Number(f.cantidad || 0) * (1 + Number(f.merma || 0) / 100) * Number(f.costoUnitario || 0), 0)
  const titulo = producto.tipo === 'SERVICIO' ? 'Insumos que gasta' : 'Componentes'

  return (
    <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
      <div>
        <p className="font-semibold">{titulo}</p>
        <p className="text-xs text-suave">Cantidad por cada unidad vendida. Al vender se descuentan de las existencias.</p>
      </div>
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}
      {guardar.isSuccess && <Alerta tipo="exito">Receta guardada.</Alerta>}
      {receta.bloqueada && editable && (
        <Alerta tipo="info">Esta receta ya se usó en ventas: al guardar cambios se crea una versión nueva y las ventas anteriores no cambian.</Alerta>
      )}
      {filas.length > 0 && (
        <table className="w-full text-sm">
          <thead className="text-left text-suave">
            <tr>
              <th className="py-1 font-medium">Insumo</th>
              <th className="w-28 py-1 font-medium">Cantidad</th>
              <th className="w-24 py-1 font-medium">Merma %</th>
              <th className="hidden w-28 py-1 text-right font-medium sm:table-cell">Costo</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {filas.map((f, indice) => (
              <tr key={f.item}>
                <td className="py-1.5">{f.nombre}</td>
                <td className="py-1.5">
                  <div className="flex items-center gap-1">
                    <input type="number" step="any" min="0" disabled={!editable} value={f.cantidad} onChange={(e) => cambiar(indice, 'cantidad', e.target.value)} className="w-20 border border-borde bg-superficie px-2 py-1" />
                    <span className="text-xs text-suave">{f.unidad}</span>
                  </div>
                </td>
                <td className="py-1.5">
                  <input type="number" step="any" min="0" max="100" disabled={!editable} value={f.merma} onChange={(e) => cambiar(indice, 'merma', e.target.value)} className="w-16 border border-borde bg-superficie px-2 py-1" />
                </td>
                <td className="hidden py-1.5 text-right sm:table-cell">{pesos(Number(f.cantidad || 0) * (1 + Number(f.merma || 0) / 100) * Number(f.costoUnitario || 0))}</td>
                <td className="py-1.5 text-right">
                  {editable && (
                    <button type="button" onClick={() => setFilas(filas.filter((_, i) => i !== indice))} className="text-suave hover:text-texto" aria-label="Quitar">
                      <i className="bi bi-trash" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editable && <BuscadorComponente excluir={producto.codigo} onElegir={agregar} />}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-borde pt-3">
        <span className="text-sm">
          Costo estimado: <strong>{pesos(costo)}</strong>
        </span>
        {editable && (
          <Boton icono="bi-check-lg" cargando={guardar.isPending} disabled={filas.length === 0} onClick={() => guardar.mutate()}>
            Guardar receta
          </Boton>
        )}
      </div>
    </section>
  )
}
