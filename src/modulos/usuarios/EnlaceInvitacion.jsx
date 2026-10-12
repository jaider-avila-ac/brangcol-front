import { useState } from 'react'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'

export default function EnlaceInvitacion({ invitacion, onCerrar }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    await navigator.clipboard.writeText(invitacion.enlace)
    setCopiado(true)
  }

  return (
    <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
      <Alerta tipo={invitacion.correoEnviado ? 'exito' : 'info'}>
        {invitacion.correoEnviado
          ? 'Se envió la invitación a ' + invitacion.correo + '. También puede compartir el enlace.'
          : 'La invitación quedó creada, pero el correo no se envió. Comparta este enlace con ' + invitacion.correo + '.'}
      </Alerta>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input readOnly value={invitacion.enlace} className="min-w-0 flex-1 border border-borde bg-fondo px-3 py-2 text-xs" />
        <Boton variante="secundario" icono={copiado ? 'bi-check-lg' : 'bi-clipboard'} onClick={copiar}>
          {copiado ? 'Copiado' : 'Copiar enlace'}
        </Boton>
      </div>
      <p className="text-xs text-suave">El enlace sirve una sola vez y vence en 7 días.</p>
      <Boton variante="secundario" className="self-start" onClick={onCerrar}>
        Cerrar
      </Boton>
    </section>
  )
}
