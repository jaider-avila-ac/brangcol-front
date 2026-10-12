import { createContext, useContext } from 'react'

export const TemaContexto = createContext({ modo: 'claro', alternar: () => {} })

export function useTema() {
  return useContext(TemaContexto)
}
