import { useQuery } from '@tanstack/react-query'
import { usuariosApi } from './api'

export function useRoles() {
  return useQuery({ queryKey: ['roles'], queryFn: usuariosApi.roles, staleTime: 5 * 60 * 1000 })
}

export function opcionesDeRoles(roles) {
  return (roles || []).map((rol) => ({ valor: rol.codigo, texto: rol.nombre }))
}
