import { useEffect, useState } from 'react'

// Devuelve el valor solo cuando el usuario deja de escribir, para no consultar en cada tecla
export function useDemora(valor, milisegundos = 350) {
  const [demorado, setDemorado] = useState(valor)
  useEffect(() => {
    const espera = setTimeout(() => setDemorado(valor), milisegundos)
    return () => clearTimeout(espera)
  }, [valor, milisegundos])
  return demorado
}
