import { cantidad, pesos } from '../../config/formato'
import { CON_RECETA, nombreTipo } from './tipos'

function textoLleva(p) {
  if (!CON_RECETA.includes(p.tipo)) {
    return null
  }
  if (p.cantidadComponentes > 0) {
    return <span>{p.componentes}</span>
  }
  if (p.tipo === 'SERVICIO') {
    return <span className="text-suave">No gasta insumos</span>
  }
  return <span className="font-semibold text-marca">Falta indicar lo que {p.tipo === 'FABRICADO' ? 'gasta' : 'lleva'}</span>
}

export default function FilaProducto({ producto: p, veExistencias, onAbrir }) {
  const porAcabarse = p.minimo !== null && p.existencia !== null && Number(p.existencia) <= Number(p.minimo)
  const lleva = textoLleva(p)

  return (
    <tr onClick={onAbrir} className={'cursor-pointer hover:bg-superficie-alt ' + (p.activo ? '' : 'text-suave')}>
      <td className="px-3 py-2">
        <p className="font-medium">{p.nombre}</p>
        <p className="text-xs text-suave">
          {nombreTipo(p.tipo)} · {p.sku}
          {!p.activo && ' · inactivo'}
        </p>
        {lleva && <p className="mt-0.5 text-xs lg:hidden">{lleva}</p>}
      </td>
      <td className="hidden max-w-md px-3 py-2 lg:table-cell">{lleva || <span className="text-suave">—</span>}</td>
      {veExistencias && (
        <td className={'px-3 py-2 text-right whitespace-nowrap ' + (porAcabarse ? 'font-semibold text-marca' : '')}>
          {p.existencia === null ? (
            <span className="text-suave">—</span>
          ) : (
            <>
              {porAcabarse && <i className="bi bi-exclamation-circle mr-1" />}
              {cantidad(p.existencia)} {p.unidad}
            </>
          )}
        </td>
      )}
      <td className="hidden px-3 py-2 text-right whitespace-nowrap sm:table-cell">{p.tipo === 'INSUMO' ? '—' : pesos(p.precioConImpuesto) + ' / ' + p.unidad}</td>
    </tr>
  )
}
