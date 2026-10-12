import { useQuery } from '@tanstack/react-query'
import { tercerosApi } from './api'

const UNA_HORA = 60 * 60 * 1000

export function useTiposDocumento() {
  return useQuery({ queryKey: ['tipos-documento'], queryFn: tercerosApi.tiposDocumento, staleTime: UNA_HORA })
}

export function useBancos() {
  return useQuery({ queryKey: ['bancos'], queryFn: tercerosApi.bancos, staleTime: UNA_HORA })
}
