import { useRef } from 'react'
import Imagen from './Imagen'

export default function SubirImagen({ codigo, etiqueta, ayuda, cargando, onElegir, disabled, icono }) {
  const entrada = useRef(null)

  return (
    <div className="flex items-center gap-4">
      <Imagen codigo={codigo} alt={etiqueta} className="h-20 w-20 border border-borde" icono={icono} />
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={disabled || cargando}
          onClick={() => entrada.current.click()}
          className="flex items-center gap-2 self-start border border-borde bg-superficie px-3 py-2 text-sm hover:bg-superficie-alt disabled:text-suave"
        >
          <i className={'bi ' + (cargando ? 'bi-arrow-repeat animate-spin' : 'bi-upload')} />
          {etiqueta}
        </button>
        {ayuda && <span className="text-xs text-suave">{ayuda}</span>}
      </div>
      <input
        ref={entrada}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(evento) => {
          if (evento.target.files[0]) {
            onElegir(evento.target.files[0])
          }
          evento.target.value = ''
        }}
      />
    </div>
  )
}
