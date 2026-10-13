import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { inventarioApi } from './api'
import LineasInventario from './LineasInventario'
import SelectorBodega from './SelectorBodega'
import { useBodegas } from './useBodegas'

export default function FormularioTraslado() {
  const bodegas = useBodegas()
  if (bodegas.isPending) {
    return <Cargando />
  }
  const principal = (bodegas.data || []).find((b) => b.predeterminada)
  return <Formulario origenInicial={principal ? principal.codigo : ''} />
}

function Formulario({ origenInicial }) {
  const navegar = useNavigate()
  const consultas = useQueryClient()
  const [origen, setOrigen] = useState(origenInicial)
  const [destino, setDestino] = useState('')
  const [observacion, setObservacion] = useState('')
  const [lineas, setLineas] = useState([])

  const guardar = useMutation({
    mutationFn: () =>
      inventarioApi.registrarTraslado({
        origen,
        destino,
        observacion,
        lineas: lineas.map((l) => ({ item: l.item, cantidad: Number(l.cantidad) })),
      }),
    onSuccess: (datos) => {
      consultas.invalidateQueries({ queryKey: ['existencias'] })
      consultas.invalidateQueries({ queryKey: ['traslados'] })
      navegar('/inventario/traslados/' + datos.codigo, { replace: true })
    },
  })

  return (
    <div className="flex max-w-4xl flex-col gap-4">
      <Link to="/inventario?ver=traslados" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>
      <p className="text-sm text-suave">Los productos salen de la primera bodega ahora y entran a la segunda cuando alguien confirme que llegaron.</p>
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}

      <section className="grid grid-cols-1 gap-4 border border-borde bg-superficie p-4 md:grid-cols-2">
        <SelectorBodega id="origen" etiqueta="Sale de" valor={origen} onCambiar={(b) => { setOrigen(b); setLineas([]) }} />
        <SelectorBodega id="destino" etiqueta="Llega a" valor={destino} onCambiar={setDestino} excluir={origen} />
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="observacion" className="text-sm font-medium">
            Nota (opcional)
          </label>
          <input id="observacion" value={observacion} onChange={(e) => setObservacion(e.target.value)} maxLength={300} className="border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca" />
        </div>
      </section>

      <section className="border border-borde bg-superficie p-4">
        <LineasInventario lineas={lineas} onCambiar={setLineas} bodega={origen} sentidoFijo="SALIDA" />
      </section>

      <div>
        <Boton icono="bi-truck" cargando={guardar.isPending} disabled={lineas.length === 0 || !origen || !destino} onClick={() => guardar.mutate()}>
          Enviar
        </Boton>
      </div>
    </div>
  )
}
