import { useQuery } from '@tanstack/react-query'
import { inventarioApi } from './api'

export function useBodegas() {
  return useQuery({ queryKey: ['bodegas'], queryFn: inventarioApi.bodegas, staleTime: 5 * 60 * 1000 })
}

export function bodegasActivas(bodegas) {
  return (bodegas || []).filter((b) => b.activa).map((b) => ({ valor: b.codigo, texto: b.nombre }))
}
