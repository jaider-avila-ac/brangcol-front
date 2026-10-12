import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Cargando from '../../components/ui/Cargando'
import { authApi } from './api'

const FECHA = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

function dispositivo(agente) {
  if (!agente) {
    return 'Dispositivo desconocido'
  }
  const navegador = /Edg\//.test(agente) ? 'Edge' : /Chrome\//.test(agente) ? 'Chrome' : /Firefox\//.test(agente) ? 'Firefox' : /Safari\//.test(agente) ? 'Safari' : 'Navegador'
  const sistema = /Android/.test(agente) ? 'Android' : /iPhone|iPad/.test(agente) ? 'iOS' : /Windows/.test(agente) ? 'Windows' : /Mac OS/.test(agente) ? 'macOS' : /Linux/.test(agente) ? 'Linux' : 'otro sistema'
  return navegador + ' en ' + sistema
}

export default function MisSesiones() {
  const consultas = useQueryClient()
  const sesiones = useQuery({ queryKey: ['sesiones'], queryFn: authApi.sesiones })
  const refrescar = () => consultas.invalidateQueries({ queryKey: ['sesiones'] })
  const cerrarUna = useMutation({ mutationFn: authApi.cerrarSesion, onSuccess: refrescar })
  const cerrarOtras = useMutation({ mutationFn: authApi.cerrarOtrasSesiones, onSuccess: refrescar })

  const lista = sesiones.data || []
  const hayOtras = lista.some((sesion) => !sesion.actual)
  const error = sesiones.error || cerrarUna.error || cerrarOtras.error

  return (
    <section className="border border-borde bg-superficie p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-marca">Sesiones abiertas</h2>
        {hayOtras && (
          <Boton variante="secundario" icono="bi-box-arrow-right" cargando={cerrarOtras.isPending} onClick={() => cerrarOtras.mutate()}>
            Cerrar las demás
          </Boton>
        )}
      </div>
      {error && <Alerta>{error.message}</Alerta>}
      {sesiones.isPending ? (
        <Cargando />
      ) : (
        <ul className="divide-y divide-borde border border-borde">
          {lista.map((sesion) => (
            <li key={sesion.codigo} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-sm">
              <i className="bi bi-laptop text-xl text-suave" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {dispositivo(sesion.dispositivo)}
                  {sesion.actual && <span className="ml-2 bg-marca px-1.5 py-0.5 text-xs text-sobre-marca">Esta sesión</span>}
                </p>
                <p className="text-xs text-suave">
                  {sesion.empresa} · IP {sesion.ip} · última actividad {FECHA.format(new Date(sesion.ultimaActividad))}
                </p>
              </div>
              {!sesion.actual && (
                <Boton variante="secundario" onClick={() => cerrarUna.mutate(sesion.codigo)} disabled={cerrarUna.isPending}>
                  Cerrar
                </Boton>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
