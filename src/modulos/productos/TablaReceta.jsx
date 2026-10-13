import { pesos } from '../../config/formato'
import BuscadorComponente from './BuscadorComponente'
import { costoFila, filaDesdeProducto } from './receta'

// Componentes de un servicio, combo o fabricado con su costo. Las cantidades se escriben para "rinde" unidades
export default function TablaReceta({ filas, onCambiar, editable, excluir, rinde, onRinde }) {
  function cambiar(indice, campo, valor) {
    onCambiar(filas.map((fila, i) => (i === indice ? { ...fila, [campo]: valor } : fila)))
  }

  function agregar(item) {
    if (!filas.some((f) => f.item === item.codigo)) {
      onCambiar([...filas, filaDesdeProducto(item)])
    }
  }

  const unidades = Number(rinde) > 0 ? Number(rinde) : 1
  let costo = 0
  for (const f of filas) {
    costo += costoFila(f)
  }

  return (
    <div className="flex flex-col gap-3">
      {editable && (
        <label className="flex flex-wrap items-center gap-2 text-sm">
          Las cantidades de abajo son para
          <input type="number" min="1" step="1" value={rinde} onChange={(e) => onRinde(e.target.value)} className="w-24 border border-borde bg-superficie px-2 py-1" />
          unidades
          <span className="text-xs text-suave">(ej. 100 hojas para 100 sobres)</span>
        </label>
      )}
      {filas.length > 0 && (
        <table className="w-full text-sm">
          <thead className="text-left text-suave">
            <tr>
              <th className="py-1 font-medium">Lleva</th>
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
                <td className="hidden py-1.5 text-right sm:table-cell">{pesos(costoFila(f))}</td>
                <td className="py-1.5 text-right">
                  {editable && (
                    <button type="button" onClick={() => onCambiar(filas.filter((_, i) => i !== indice))} className="text-suave hover:text-texto" aria-label="Quitar">
                      <i className="bi bi-trash" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editable && <BuscadorComponente excluir={excluir} onElegir={agregar} />}
      <p className="text-sm">
        Costo estimado por unidad: <strong>{pesos(costo / unidades)}</strong>
      </p>
    </div>
  )
}
