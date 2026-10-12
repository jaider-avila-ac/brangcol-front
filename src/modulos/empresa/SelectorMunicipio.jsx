import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { empresaApi } from './api'

export default function SelectorMunicipio({ id, etiqueta, valor, nombre, onCambiar, error, disabled }) {
  const [texto, setTexto] = useState(nombre || '')
  const [abierto, setAbierto] = useState(false)
  const busqueda = texto.trim()
  const resultados = useQuery({
    queryKey: ['municipios', busqueda],
    queryFn: () => empresaApi.municipios(busqueda),
    enabled: abierto && busqueda.length >= 2,
    staleTime: 10 * 60 * 1000,
  })

  function elegir(municipio) {
    setTexto(municipio.nombre + ' (' + municipio.departamento + ')')
    setAbierto(false)
    onCambiar(municipio.codigo)
  }

  return (
    <div className="relative flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-texto">
        {etiqueta}
      </label>
      <input
        id={id}
        value={texto}
        disabled={disabled}
        autoComplete="off"
        placeholder="Escriba para buscar"
        onChange={(evento) => {
          setTexto(evento.target.value)
          setAbierto(true)
          onCambiar('')
        }}
        onBlur={() => setTimeout(() => setAbierto(false), 150)}
        className={
          'border bg-superficie px-3 py-2 text-sm outline-none focus:border-marca disabled:bg-fondo ' +
          (error ? 'border-peligro' : 'border-borde')
        }
      />
      {abierto && resultados.data && (
        <ul className="absolute top-full right-0 left-0 z-20 max-h-56 overflow-y-auto border border-borde bg-superficie shadow-md">
          {resultados.data.length === 0 && <li className="px-3 py-2 text-sm text-suave">Sin resultados</li>}
          {resultados.data.map((municipio) => (
            <li key={municipio.codigo}>
              <button
                type="button"
                onMouseDown={() => elegir(municipio)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-superficie-alt"
              >
                {municipio.nombre} <span className="text-suave">({municipio.departamento})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <input type="hidden" value={valor || ''} readOnly />
      {error && <span className="text-xs text-peligro">{error}</span>}
    </div>
  )
}
