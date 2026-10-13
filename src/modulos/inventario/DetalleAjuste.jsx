import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { cantidad, fecha, pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import Anular from './Anular'
import { inventarioApi } from './api'
import Dato from './Dato'
import { CLASES, ESTADOS } from './textos'

export default function DetalleAjuste() {
  const { codigo } = useParams()
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const ajuste = useQuery({ queryKey: ['ajuste', codigo], queryFn: () => inventarioApi.ajuste(codigo) })
  const anular = useMutation({
    mutationFn: (motivo) => inventarioApi.anularAjuste(codigo, motivo),
    onSuccess: (datos) => {
      consultas.setQueryData(['ajuste', codigo], datos)
      consultas.invalidateQueries({ queryKey: ['existencias'] })
      consultas.invalidateQueries({ queryKey: ['ajustes'] })
    },
  })

  if (ajuste.isPending) {
    return <Cargando />
  }
  if (ajuste.isError) {
    return <Alerta>{ajuste.error.message}</Alerta>
  }
  const a = ajuste.data
  return (
    <div className="flex max-w-4xl flex-col gap-4">
      <Link to="/inventario?ver=movimientos" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>

      <section className="grid grid-cols-2 gap-4 border border-borde bg-superficie p-4 md:grid-cols-4">
        <Dato etiqueta="Número" valor={a.numero} />
        <Dato etiqueta="Qué fue" valor={CLASES[a.clase]} />
        <Dato etiqueta="Bodega" valor={a.bodega} />
        <Dato etiqueta="Fecha" valor={fecha(a.fecha)} />
        <div className="col-span-2 md:col-span-3">
          <Dato etiqueta="Motivo" valor={a.motivo} />
        </div>
        <Dato etiqueta="Estado" valor={ESTADOS[a.estado]} />
      </section>

      <div className="overflow-x-auto border border-borde bg-superficie">
        <table className="w-full text-sm">
          <thead className="bg-superficie-alt text-left text-suave">
            <tr>
              <th className="px-3 py-2 font-medium">Producto</th>
              <th className="px-3 py-2 font-medium">Movimiento</th>
              <th className="px-3 py-2 text-right font-medium">Cantidad</th>
              <th className="px-3 py-2 text-right font-medium">Costo por unidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {a.lineas.map((l) => (
              <tr key={l.item}>
                <td className="px-3 py-2">{l.nombre}</td>
                <td className="px-3 py-2">{l.sentido === 'ENTRADA' ? 'Entró' : 'Salió'}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {cantidad(l.cantidad)} {l.unidad}
                </td>
                <td className="px-3 py-2 text-right">{l.costo === null ? 'Costo actual' : pesos(l.costo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {a.estado === 'APLICADO' && tienePermiso(sesion, 'inventario:ajuste:gestionar') && (
        <div>
          <Anular
            texto="Anular"
            ayuda="Las cantidades vuelven a como estaban antes de este registro."
            cargando={anular.isPending}
            error={anular.error}
            onAnular={(motivo) => anular.mutate(motivo)}
          />
        </div>
      )}
    </div>
  )
}
