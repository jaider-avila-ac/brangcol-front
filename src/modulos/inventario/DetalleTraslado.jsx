import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { cantidad, fechaHora } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import Anular from './Anular'
import { inventarioApi } from './api'
import Dato from './Dato'
import RecibirTraslado from './RecibirTraslado'
import { ESTADOS } from './textos'

export default function DetalleTraslado() {
  const { codigo } = useParams()
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const traslado = useQuery({ queryKey: ['traslado', codigo], queryFn: () => inventarioApi.traslado(codigo) })
  const alTerminar = (datos) => {
    consultas.setQueryData(['traslado', codigo], datos)
    consultas.invalidateQueries({ queryKey: ['existencias'] })
    consultas.invalidateQueries({ queryKey: ['traslados'] })
  }
  const anular = useMutation({ mutationFn: (motivo) => inventarioApi.anularTraslado(codigo, motivo), onSuccess: alTerminar })
  const recibir = useMutation({ mutationFn: (lineas) => inventarioApi.recibirTraslado(codigo, lineas), onSuccess: alTerminar })
  const gestiona = tienePermiso(sesion, 'inventario:traslado:gestionar')

  if (traslado.isPending) {
    return <Cargando />
  }
  if (traslado.isError) {
    return <Alerta>{traslado.error.message}</Alerta>
  }
  const t = traslado.data
  const enCamino = t.estado === 'ENVIADO'
  return (
    <div className="flex max-w-4xl flex-col gap-4">
      <Link to="/inventario?ver=traslados" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>

      <section className="grid grid-cols-2 gap-4 border border-borde bg-superficie p-4 md:grid-cols-4">
        <Dato etiqueta="Número" valor={t.numero} />
        <Dato etiqueta="Estado" valor={ESTADOS[t.estado]} />
        <Dato etiqueta="Sale de" valor={t.origen} />
        <Dato etiqueta="Llega a" valor={t.destino} />
        <Dato etiqueta="Enviado" valor={fechaHora(t.enviadoEn)} />
        <Dato etiqueta="Recibido" valor={fechaHora(t.recibidoEn)} />
        {t.observacion && (
          <div className="col-span-2">
            <Dato etiqueta="Nota" valor={t.observacion} />
          </div>
        )}
      </section>

      {enCamino && gestiona ? (
        <RecibirTraslado lineas={t.lineas} cargando={recibir.isPending} error={recibir.error} onRecibir={(lineas) => recibir.mutate(lineas)} />
      ) : (
        <div className="overflow-x-auto border border-borde bg-superficie">
          <table className="w-full text-sm">
            <thead className="bg-superficie-alt text-left text-suave">
              <tr>
                <th className="px-3 py-2 font-medium">Producto</th>
                <th className="px-3 py-2 text-right font-medium">Enviado</th>
                <th className="px-3 py-2 text-right font-medium">Recibido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {t.lineas.map((l) => (
                <tr key={l.item}>
                  <td className="px-3 py-2">{l.nombre}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {cantidad(l.cantidad)} {l.unidad}
                  </td>
                  <td className={'px-3 py-2 text-right whitespace-nowrap ' + (l.recibida !== null && Number(l.recibida) < Number(l.cantidad) ? 'font-semibold text-marca' : '')}>
                    {l.recibida === null ? '—' : cantidad(l.recibida) + ' ' + l.unidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {enCamino && gestiona && (
        <div>
          <Anular
            texto="Anular traslado"
            ayuda="Los productos vuelven a la bodega de donde salieron."
            cargando={anular.isPending}
            error={anular.error}
            onAnular={(motivo) => anular.mutate(motivo)}
          />
        </div>
      )}
    </div>
  )
}
