import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { usuariosApi } from './api'
import EnlaceInvitacion from './EnlaceInvitacion'
import FormularioInvitacion from './FormularioInvitacion'

const FECHA = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' })

export default function Invitaciones({ puedeGestionar }) {
  const consultas = useQueryClient()
  const [creada, setCreada] = useState(null)
  const pendientes = useQuery({ queryKey: ['invitaciones'], queryFn: usuariosApi.invitaciones })
  const revocar = useMutation({
    mutationFn: usuariosApi.revocar,
    onSuccess: () => consultas.invalidateQueries({ queryKey: ['invitaciones'] }),
  })

  function alCrear(invitacion) {
    setCreada(invitacion)
    consultas.invalidateQueries({ queryKey: ['invitaciones'] })
  }

  return (
    <div className="flex flex-col gap-4">
      {puedeGestionar && <FormularioInvitacion onCreada={alCrear} />}
      {creada && <EnlaceInvitacion invitacion={creada} onCerrar={() => setCreada(null)} />}

      <section className="border border-borde bg-superficie p-4">
        <h2 className="mb-3 font-semibold text-marca">Invitaciones pendientes</h2>
        {(pendientes.error || revocar.error) && <Alerta>{(pendientes.error || revocar.error).message}</Alerta>}
        {pendientes.isPending ? (
          <Cargando />
        ) : pendientes.data.length === 0 ? (
          <p className="text-sm text-suave">No hay invitaciones pendientes.</p>
        ) : (
          <ul className="divide-y divide-borde border border-borde">
            {pendientes.data.map((invitacion) => (
              <li key={invitacion.codigo} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-sm">
                <i className="bi bi-envelope text-lg text-suave" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium break-all">{invitacion.correo}</p>
                  <p className="text-xs text-suave">
                    {invitacion.rol} · vence el {FECHA.format(new Date(invitacion.venceEn))}
                  </p>
                </div>
                {puedeGestionar && (
                  <button
                    type="button"
                    disabled={revocar.isPending}
                    onClick={() => revocar.mutate(invitacion.codigo)}
                    className="border border-borde px-2 py-1 text-xs hover:bg-superficie-alt"
                  >
                    Anular
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
