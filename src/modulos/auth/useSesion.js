import { useQuery } from '@tanstack/react-query'
import { authApi } from './api'

export const CLAVE_SESION = ['sesion']

export function useSesion() {
  return useQuery({
    queryKey: CLAVE_SESION,
    queryFn: authApi.yo,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function tienePermiso(sesion, permiso) {
  if (!permiso) {
    return true
  }
  if (!sesion) {
    return false
  }
  return sesion.permisos.includes(permiso)
}
