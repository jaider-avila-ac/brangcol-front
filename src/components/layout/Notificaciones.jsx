import { useRef, useState } from 'react'
import { useClicFuera } from './useClicFuera'

export default function Notificaciones() {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  useClicFuera(contenedor, () => setAbierto(false))

  return (
    <div className="relative" ref={contenedor}>
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        title="Notificaciones"
        className="relative flex h-10 w-10 items-center justify-center text-lg text-suave hover:bg-superficie-alt hover:text-texto"
      >
        <i className="bi bi-bell" />
      </button>
      {abierto && (
        <div className="absolute right-0 z-40 mt-1 w-80 border border-borde bg-superficie shadow-lg">
          <p className="border-b border-borde px-4 py-3 text-sm font-semibold">Notificaciones</p>
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-sm text-suave">
            <i className="bi bi-bell-slash text-2xl" />
            No tiene notificaciones
          </div>
        </div>
      )}
    </div>
  )
}
