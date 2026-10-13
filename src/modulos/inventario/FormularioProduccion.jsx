import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { productosApi } from '../productos/api'
import { inventarioApi } from './api'
import GastoProduccion from './GastoProduccion'
import SelectorBodega from './SelectorBodega'
import { useBodegas } from './useBodegas'

export default function FormularioProduccion() {
  const bodegas = useBodegas()
  const fabricados = useQuery({ queryKey: ['productos', 'fabricados'], queryFn: () => productosApi.buscar({ tipo: 'FABRICADO', tamano: 100 }) })
  if (bodegas.isPending || fabricados.isPending) {
    return <Cargando />
  }
  const principal = (bodegas.data || []).find((b) => b.predeterminada)
  return <Formulario bodegaInicial={principal ? principal.codigo : ''} fabricados={fabricados.data ? fabricados.data.content : []} />
}

// Registrar que se produjo: gasta lo que dice la receta y entra el producto terminado
function Formulario({ bodegaInicial, fabricados }) {
  const navegar = useNavigate()
  const consultas = useQueryClient()
  const [item, setItem] = useState('')
  const [bodega, setBodega] = useState(bodegaInicial)
  const [cantidadTexto, setCantidadTexto] = useState('')
  const [observacion, setObservacion] = useState('')
  const elegido = fabricados.find((f) => f.codigo === item)

  const guardar = useMutation({
    mutationFn: () => inventarioApi.registrarProduccion({ item, bodega, cantidad: Number(cantidadTexto), observacion }),
    onSuccess: (datos) => {
      consultas.invalidateQueries({ queryKey: ['existencias'] })
      consultas.invalidateQueries({ queryKey: ['producciones'] })
      navegar('/inventario/produccion/' + datos.codigo, { replace: true })
    },
  })

  if (fabricados.length === 0) {
    return (
      <div className="flex max-w-3xl flex-col gap-4">
        <Link to="/inventario?ver=produccion" className="text-sm text-marca hover:underline">
          <i className="bi bi-arrow-left" /> Volver
        </Link>
        <Alerta tipo="info">
          Todavía no hay productos fabricados. Créelos en <Link to="/productos/nuevo?tipo=FABRICADO" className="underline">Productos y servicios</Link> indicando lo que gastan.
        </Alerta>
      </div>
    )
  }

  const clase = 'border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca'
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Link to="/inventario?ver=produccion" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}

      <section className="grid grid-cols-1 gap-4 border border-borde bg-superficie p-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="item" className="text-sm font-medium">
            ¿Qué produjo?
          </label>
          <select id="item" value={item} onChange={(e) => setItem(e.target.value)} className={clase}>
            <option value="">Elija el producto</option>
            {fabricados.map((f) => (
              <option key={f.codigo} value={f.codigo}>
                {f.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cantidad" className="text-sm font-medium">
            ¿Cuántos?
          </label>
          <div className="flex items-center gap-2">
            <input id="cantidad" type="number" min="0" step="any" value={cantidadTexto} onChange={(e) => setCantidadTexto(e.target.value)} className={clase + ' w-40'} />
            {elegido && <span className="text-sm text-suave">{elegido.unidad}</span>}
          </div>
        </div>
        <SelectorBodega id="bodega" etiqueta="Bodega" valor={bodega} onCambiar={setBodega} />
        <div className="flex flex-col gap-1">
          <label htmlFor="observacion" className="text-sm font-medium">
            Nota (opcional)
          </label>
          <input id="observacion" value={observacion} onChange={(e) => setObservacion(e.target.value)} maxLength={300} placeholder="Ej. Pedido de la iglesia" className={clase} />
        </div>
      </section>

      {item && <GastoProduccion item={item} cantidad={Number(cantidadTexto) || 0} />}

      <div>
        <Boton icono="bi-check-lg" cargando={guardar.isPending} disabled={!item || !bodega || !(Number(cantidadTexto) > 0)} onClick={() => guardar.mutate()}>
          Registrar producción
        </Boton>
      </div>
    </div>
  )
}
