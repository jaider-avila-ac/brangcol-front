import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDemora } from '../../components/ui/useDemora'
import { cantidad } from '../../config/formato'
import { inventarioApi } from './api'

// Busca productos con existencias y muestra cuanto hay en la bodega elegida
export default function BuscadorExistencia({ bodega, excluir, onElegir }) {
  const [texto, setTexto] = useState('')
  const busqueda = useDemora(texto.trim())
  const resultados = useQuery({
    queryKey: ['existencias', 'buscador', bodega, busqueda],
    queryFn: () => inventarioApi.existencias({ texto: busqueda, bodega, tamano: 8 }),
    enabled: busqueda.length >= 2,
  })
  const lista = resultados.data ? resultados.data.content.filter((e) => !excluir.includes(e.item)) : []

  return (
    <div className="relative">
      <i className="bi bi-plus-circle absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
      <input
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder="Agregar producto: escriba su nombre, código o lea el código de barras"
        className="w-full border border-borde bg-superficie py-2 pr-3 pl-9 text-sm outline-none focus:border-marca"
      />
      {busqueda.length >= 2 && resultados.data && (
        <ul className="absolute top-full right-0 left-0 z-20 max-h-64 overflow-y-auto border border-borde bg-superficie shadow-md">
          {lista.length === 0 && <li className="px-3 py-2 text-sm text-suave">No hay productos con ese nombre</li>}
          {lista.map((e) => (
            <li key={e.item}>
              <button
                type="button"
                onClick={() => {
                  onElegir(e)
                  setTexto('')
                }}
                className="flex w-full justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-superficie-alt"
              >
                <span>{e.nombre}</span>
                <span className="text-xs whitespace-nowrap text-suave">
                  Tiene {cantidad(e.cantidad)} {e.unidad}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
