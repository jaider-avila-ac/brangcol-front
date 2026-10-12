import { useQuery } from '@tanstack/react-query'
import { productosApi } from './api'

const UNA_HORA = 60 * 60 * 1000

export function useUnidades() {
  return useQuery({ queryKey: ['unidades'], queryFn: productosApi.unidades, staleTime: UNA_HORA })
}

export function useImpuestos() {
  return useQuery({ queryKey: ['impuestos'], queryFn: productosApi.impuestos, staleTime: UNA_HORA })
}

export function useCategorias() {
  return useQuery({ queryKey: ['categorias'], queryFn: productosApi.categorias })
}

export function useMarcas() {
  return useQuery({ queryKey: ['marcas'], queryFn: productosApi.marcas })
}
