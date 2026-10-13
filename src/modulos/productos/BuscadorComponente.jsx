import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDemora } from '../../components/ui/useDemora'
import { productosApi } from './api'

export default function BuscadorComponente({ excluir, onElegir }) {
  const [texto, setTexto] = useState('')
  const busqueda = useDemora(texto.trim())
  const resultados = useQuery({
    queryKey: ['componentes', busqueda],
    queryFn: () => productosApi.buscar({ texto: busqueda, soloComponentes: true, tamano: 8 }),
    enabled: busqueda.length >= 2,
  })
  const lista = resultados.data ? resultados.data.content.filter((p) => p.codigo !== excluir) : []

  return (
    <div className="relative">
      <i className="bi bi-plus-circle absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
      <input
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        onKeyDown={(evento) => {
          if (evento.key === 'Enter') {
            evento.preventDefault()
          }
        }}
        placeholder="Agregar: escriba el nombre del producto o insumo"
        className="w-full border border-borde bg-superficie py-2 pr-3 pl-9 text-sm outline-none focus:border-marca"
      />
      {busqueda.length >= 2 && resultados.data && (
        <ul className="absolute top-full right-0 left-0 z-20 max-h-60 overflow-y-auto border border-borde bg-superficie shadow-md">
          {lista.length === 0 && <li className="px-3 py-2 text-sm text-suave">No hay productos con ese nombre</li>}
          {lista.map((item) => (
            <li key={item.codigo}>
              <button
                type="button"
                onClick={() => {
                  onElegir(item)
                  setTexto('')
                }}
                className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-superficie-alt"
              >
                <span>{item.nombre}</span>
                <span className="text-xs text-suave">{item.unidad}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
