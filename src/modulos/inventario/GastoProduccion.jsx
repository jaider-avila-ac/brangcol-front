import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { cantidad as formatoCantidad, pesos } from '../../config/formato'
import { productosApi } from '../productos/api'

// Muestra lo que se va a gastar segun la receta del fabricado
export default function GastoProduccion({ item, cantidad }) {
  const receta = useQuery({ queryKey: ['receta', item], queryFn: () => productosApi.receta(item) })

  if (receta.isPending) {
    return <Cargando />
  }
  if (receta.isError) {
    return <Alerta>{receta.error.message}</Alerta>
  }
  if (receta.data.componentes.length === 0) {
    return (
      <Alerta>
        Este producto no tiene indicado lo que gasta. <Link to={'/productos/' + item} className="underline">Complételo aquí</Link>.
      </Alerta>
    )
  }
  let costo = 0
  for (const c of receta.data.componentes) {
    costo += Number(c.cantidad) * (1 + Number(c.merma) / 100) * Number(c.costoUnitario) * cantidad
  }
  return (
    <section className="flex flex-col gap-2 border border-borde bg-superficie p-4">
      <p className="font-semibold">Se va a gastar</p>
      <ul className="text-sm">
        {receta.data.componentes.map((c) => (
          <li key={c.item} className="flex justify-between border-b border-borde py-1.5 last:border-0">
            <span>{c.nombre}</span>
            <span>
              {formatoCantidad(Number(c.cantidad) * (1 + Number(c.merma) / 100) * cantidad)} {c.unidad}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-suave">
        Costo de esta producción: <strong className="text-texto">{pesos(costo)}</strong>
      </p>
    </section>
  )
}
