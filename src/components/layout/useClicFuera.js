import { useEffect } from 'react'

export function useClicFuera(referencia, alClicFuera) {
  useEffect(() => {
    function alPresionar(evento) {
      if (referencia.current && !referencia.current.contains(evento.target)) {
        alClicFuera()
      }
    }
    document.addEventListener('mousedown', alPresionar)
    return () => document.removeEventListener('mousedown', alPresionar)
  }, [referencia, alClicFuera])
}
