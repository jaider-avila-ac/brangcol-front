import { cantidad } from '../../config/formato'
import BuscadorExistencia from './BuscadorExistencia'

// Editor de los productos de un documento. conSentido: elegir entrada o salida; conCosto: costo de las entradas
export default function LineasInventario({ lineas, onCambiar, bodega, conSentido, conCosto, sentidoFijo }) {
  function agregar(existencia) {
    onCambiar([
      ...lineas,
      {
        item: existencia.item,
        nombre: existencia.nombre,
        unidad: existencia.unidad,
        permiteFraccion: existencia.permiteFraccion,
        disponible: existencia.cantidad,
        sentido: sentidoFijo || 'ENTRADA',
        cantidad: '',
        costo: Number(existencia.costoPromedio) > 0 ? String(Number(existencia.costoPromedio)) : '',
      },
    ])
  }

  function cambiar(indice, campo, valor) {
    const copia = [...lineas]
    copia[indice] = { ...copia[indice], [campo]: valor }
    onCambiar(copia)
  }

  function quitar(indice) {
    onCambiar(lineas.filter((_, i) => i !== indice))
  }

  const clase = 'w-full border border-borde bg-superficie px-2 py-1.5 text-sm outline-none focus:border-marca'

  return (
    <div className="flex flex-col gap-3">
      <BuscadorExistencia bodega={bodega} excluir={lineas.map((l) => l.item)} onElegir={agregar} />
      {lineas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-suave">
              <tr>
                <th className="py-2 pr-3 font-medium">Producto</th>
                {conSentido && <th className="py-2 pr-3 font-medium">Entra o sale</th>}
                <th className="py-2 pr-3 font-medium">Cantidad</th>
                {conCosto && <th className="py-2 pr-3 font-medium">Costo por unidad</th>}
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {lineas.map((l, indice) => (
                <tr key={l.item}>
                  <td className="py-2 pr-3">
                    <p>{l.nombre}</p>
                    <p className="text-xs text-suave">
                      Tiene {cantidad(l.disponible)} {l.unidad}
                    </p>
                  </td>
                  {conSentido && (
                    <td className="py-2 pr-3">
                      <select value={l.sentido} onChange={(e) => cambiar(indice, 'sentido', e.target.value)} className={clase}>
                        <option value="ENTRADA">Entra</option>
                        <option value="SALIDA">Sale</option>
                      </select>
                    </td>
                  )}
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step={l.permiteFraccion ? 'any' : '1'}
                        value={l.cantidad}
                        onChange={(e) => cambiar(indice, 'cantidad', e.target.value)}
                        className={clase + ' w-28'}
                      />
                      <span className="text-xs text-suave">{l.unidad}</span>
                    </div>
                  </td>
                  {conCosto && (
                    <td className="py-2 pr-3">
                      {l.sentido === 'ENTRADA' ? (
                        <input type="number" min="0" step="any" value={l.costo} onChange={(e) => cambiar(indice, 'costo', e.target.value)} placeholder="Costo actual" className={clase + ' w-32'} />
                      ) : (
                        <span className="text-xs text-suave">Al costo actual</span>
                      )}
                    </td>
                  )}
                  <td className="py-2 text-right">
                    <button type="button" onClick={() => quitar(indice)} className="text-suave hover:text-marca" aria-label="Quitar">
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
