import { useState } from 'react'

// Se escribe o se lee con el lector y se agrega con Enter
export default function CodigosBarras({ valor, onCambiar, disabled }) {
  const [texto, setTexto] = useState('')

  function agregar() {
    const codigo = texto.trim()
    if (codigo && !valor.includes(codigo)) {
      onCambiar([...valor, codigo])
    }
    setTexto('')
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">Códigos de barras</span>
      <div className="flex flex-wrap items-center gap-2 border border-borde bg-superficie px-2 py-1.5">
        {valor.map((codigo) => (
          <span key={codigo} className="flex items-center gap-1 bg-superficie-alt px-2 py-1 text-xs">
            {codigo}
            {!disabled && (
              <button type="button" onClick={() => onCambiar(valor.filter((c) => c !== codigo))} aria-label="Quitar">
                <i className="bi bi-x" />
              </button>
            )}
          </span>
        ))}
        {!disabled && (
          <input
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') {
                evento.preventDefault()
                agregar()
              }
            }}
            onBlur={agregar}
            placeholder="Escriba o lea el código y presione Enter"
            className="min-w-48 flex-1 py-1 text-sm outline-none"
          />
        )}
      </div>
    </div>
  )
}
