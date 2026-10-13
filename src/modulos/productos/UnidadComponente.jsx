import { useQuery } from '@tanstack/react-query'
import { productosApi } from './api'

// Unidad en que se escribe un componente de la receta: la base del insumo o una de sus presentaciones
// (ej. hojas o resmas). Al cambiarla, el costo pasa a ser el de esa unidad.
export default function UnidadComponente({ fila, editable, onCambiar }) {
  const producto = useQuery({ queryKey: ['producto', fila.item], queryFn: () => productosApi.obtener(fila.item), staleTime: 60 * 1000 })
  const datos = producto.data

  if (!datos || datos.unidades.length === 0 || !editable) {
    return <span className="text-xs text-suave">{fila.unidad}</span>
  }

  function elegir(valor) {
    if (valor === '') {
      onCambiar({ presentacion: null, unidad: datos.unidadSimbolo, costoUnitario: datos.costoPromedio })
      return
    }
    const presentacion = datos.unidades.find((u) => u.unidad === valor)
    onCambiar({
      presentacion: valor,
      unidad: presentacion.unidadNombre.toLowerCase(),
      costoUnitario: Number(datos.costoPromedio) * Number(presentacion.factor),
    })
  }

  return (
    <select value={fila.presentacion || ''} onChange={(e) => elegir(e.target.value)} className="border border-borde bg-superficie px-1 py-1 text-xs">
      <option value="">{datos.unidadSimbolo}</option>
      {datos.unidades.map((u) => (
        <option key={u.unidad} value={u.unidad}>
          {u.unidadNombre.toLowerCase()} ({Number(u.factor)} {datos.unidadSimbolo})
        </option>
      ))}
    </select>
  )
}
