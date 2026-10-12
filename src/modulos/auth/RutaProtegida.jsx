import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, useLocation, useNavigate } from 'react-router'
import Cargando from '../../components/ui/Cargando'
import Alerta from '../../components/ui/Alerta'
import { CLAVE_SESION, useSesion } from './useSesion'

export default function RutaProtegida({ children }) {
  const { data, isPending, error } = useSesion()
  const ubicacion = useLocation()
  const navegar = useNavigate()
  const consultas = useQueryClient()

  useEffect(() => {
    function alVencer() {
      if (!consultas.getQueryData(CLAVE_SESION)) {
        return
      }
      consultas.removeQueries({ queryKey: CLAVE_SESION })
      navegar('/login', { replace: true, state: { vencida: true } })
    }
    window.addEventListener('sesion-vencida', alVencer)
    return () => window.removeEventListener('sesion-vencida', alVencer)
  }, [consultas, navegar])

  if (isPending) {
    return <Cargando />
  }
  if (error && error.estado === 401) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }
  if (error) {
    return (
      <div className="p-6">
        <Alerta>{error.message}</Alerta>
      </div>
    )
  }
  if (!data) {
    return <Navigate to="/login" replace />
  }
  return children
}
