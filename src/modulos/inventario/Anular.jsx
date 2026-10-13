import { useState } from 'react'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'

// Boton de anular que pide el motivo antes de confirmar
export default function Anular({ texto, ayuda, cargando, error, onAnular }) {
  const [abierto, setAbierto] = useState(false)
  const [motivo, setMotivo] = useState('')

  if (!abierto) {
    return (
      <Boton variante="secundario" icono="bi-x-circle" onClick={() => setAbierto(true)}>
        {texto}
      </Boton>
    )
  }
  return (
    <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
      <p className="font-semibold">{texto}</p>
      {ayuda && <p className="text-sm text-suave">{ayuda}</p>}
      {error && <Alerta>{error.message}</Alerta>}
      <input value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={300} placeholder="¿Por qué se anula?" autoFocus className="border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca" />
      <div className="flex gap-2">
        <Boton cargando={cargando} disabled={motivo.trim().length < 5} onClick={() => onAnular(motivo)}>
          Confirmar
        </Boton>
        <Boton variante="secundario" onClick={() => setAbierto(false)}>
          Cancelar
        </Boton>
      </div>
    </section>
  )
}
