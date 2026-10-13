import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { cantidad, fechaHora, pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import Anular from './Anular'
import { inventarioApi } from './api'
import Dato from './Dato'
import { ESTADOS } from './textos'

export default function DetalleProduccion() {
  const { codigo } = useParams()
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const produccion = useQuery({ queryKey: ['produccion', codigo], queryFn: () => inventarioApi.produccion(codigo) })
  const anular = useMutation({
    mutationFn: (motivo) => inventarioApi.anularProduccion(codigo, motivo),
    onSuccess: (datos) => {
      consultas.setQueryData(['produccion', codigo], datos)
      consultas.invalidateQueries({ queryKey: ['existencias'] })
      consultas.invalidateQueries({ queryKey: ['producciones'] })
    },
  })

  if (produccion.isPending) {
    return <Cargando />
  }
  if (produccion.isError) {
    return <Alerta>{produccion.error.message}</Alerta>
  }
  const p = produccion.data
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Link to="/inventario?ver=produccion" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>
      <section className="grid grid-cols-2 gap-4 border border-borde bg-superficie p-4 md:grid-cols-3">
        <Dato etiqueta="Número" valor={p.numero} />
        <Dato etiqueta="Producto" valor={p.nombre} />
        <Dato etiqueta="Cantidad" valor={cantidad(p.cantidad) + ' ' + p.unidad} />
        <Dato etiqueta="Costo por unidad" valor={pesos(p.costoUnitario)} />
        <Dato etiqueta="Bodega" valor={p.bodega} />
        <Dato etiqueta="Fecha" valor={fechaHora(p.fecha)} />
        <Dato etiqueta="Estado" valor={ESTADOS[p.estado]} />
        {p.observacion && (
          <div className="col-span-2">
            <Dato etiqueta="Nota" valor={p.observacion} />
          </div>
        )}
      </section>
      <p className="text-sm">
        <Link to={'/productos/' + p.item + '?ver=movimientos'} className="text-marca hover:underline">
          Ver los movimientos de {p.nombre}
        </Link>
      </p>
      {p.estado === 'EJECUTADA' && tienePermiso(sesion, 'inventario:ensamble:gestionar') && (
        <div>
          <Anular
            texto="Anular producción"
            ayuda="Lo que se gastó vuelve a las existencias y sale el producto terminado."
            cargando={anular.isPending}
            error={anular.error}
            onAnular={(motivo) => anular.mutate(motivo)}
          />
        </div>
      )}
    </div>
  )
}
