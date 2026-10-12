import { useState } from 'react'
import { aplicarTema, temaGuardado } from '../../config/tema'
import { TemaContexto } from '../../config/temaContexto'

export default function ProveedorTema({ children }) {
  const [modo, setModo] = useState(temaGuardado)

  function alternar() {
    const nuevo = modo === 'oscuro' ? 'claro' : 'oscuro'
    aplicarTema(nuevo)
    setModo(nuevo)
  }

  return <TemaContexto.Provider value={{ modo, alternar }}>{children}</TemaContexto.Provider>
}
