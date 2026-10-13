import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { inventarioApi } from './api'
import { lineasAPeticion } from './lineas'
import LineasInventario from './LineasInventario'
import SelectorBodega from './SelectorBodega'
import { CLASES } from './textos'
import { useBodegas } from './useBodegas'

const AYUDAS = {
  AJUSTE: 'Para corregir lo que hay: productos dañados, sobrantes, faltantes o regalos.',
  INICIAL: 'Para cargar lo que ya tenía en la bodega antes de empezar a usar el sistema, con su costo.',
  CONSUMO_INTERNO: 'Productos que la empresa gasta en su propio funcionamiento.',
}

const SENTIDO_FIJO = { INICIAL: 'ENTRADA', CONSUMO_INTERNO: 'SALIDA' }

export default function FormularioAjuste() {
  const bodegas = useBodegas()
  if (bodegas.isPending) {
    return <Cargando />
  }
  const principal = (bodegas.data || []).find((b) => b.predeterminada)
  return <Formulario bodegaInicial={principal ? principal.codigo : ''} />
}

function Formulario({ bodegaInicial }) {
  const [parametros] = useSearchParams()
  const navegar = useNavigate()
  const consultas = useQueryClient()
  const claseInicial = CLASES[parametros.get('clase')] ? parametros.get('clase') : 'AJUSTE'
  const [clase, setClase] = useState(claseInicial)
  const [bodega, setBodega] = useState(bodegaInicial)
  const [motivo, setMotivo] = useState(claseInicial === 'INICIAL' ? 'Inventario inicial' : '')
  const [lineas, setLineas] = useState([])
  const fijo = SENTIDO_FIJO[clase]

  const guardar = useMutation({
    mutationFn: () => inventarioApi.registrarAjuste({ clase, bodega, motivo, lineas: lineasAPeticion(lineas, clase !== 'CONSUMO_INTERNO') }),
    onSuccess: (datos) => {
      consultas.invalidateQueries({ queryKey: ['existencias'] })
      consultas.invalidateQueries({ queryKey: ['ajustes'] })
      navegar('/inventario/ajustes/' + datos.codigo, { replace: true })
    },
  })

  function cambiarClase(nueva) {
    setClase(nueva)
    if (SENTIDO_FIJO[nueva]) {
      setLineas(lineas.map((l) => ({ ...l, sentido: SENTIDO_FIJO[nueva] })))
    }
    if (nueva === 'INICIAL' && motivo === '') {
      setMotivo('Inventario inicial')
    }
  }

  return (
    <div className="flex max-w-4xl flex-col gap-4">
      <Link to="/inventario?ver=movimientos" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}

      <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
        <p className="font-semibold">¿Qué va a registrar?</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {Object.keys(CLASES).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => cambiarClase(c)}
              className={'border px-3 py-2 text-left text-sm ' + (clase === c ? 'border-marca bg-marca text-sobre-marca' : 'border-borde hover:bg-superficie-alt')}
            >
              {CLASES[c]}
            </button>
          ))}
        </div>
        <p className="text-sm text-suave">{AYUDAS[clase]}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 border border-borde bg-superficie p-4 md:grid-cols-2">
        <SelectorBodega id="bodega" etiqueta="Bodega" valor={bodega} onCambiar={(b) => { setBodega(b); setLineas([]) }} />
        <div className="flex flex-col gap-1">
          <label htmlFor="motivo" className="text-sm font-medium">
            Motivo
          </label>
          <input id="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={300} placeholder="Ej. Hojas dañadas por humedad" className="border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca" />
        </div>
      </section>

      <section className="border border-borde bg-superficie p-4">
        <LineasInventario lineas={lineas} onCambiar={setLineas} bodega={bodega} conSentido={!fijo} conCosto={clase !== 'CONSUMO_INTERNO'} sentidoFijo={fijo} />
      </section>

      <div>
        <Boton icono="bi-check-lg" cargando={guardar.isPending} disabled={lineas.length === 0 || !bodega} onClick={() => guardar.mutate()}>
          Registrar
        </Boton>
      </div>
    </div>
  )
}
