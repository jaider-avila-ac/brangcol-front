import { bodegasActivas, useBodegas } from './useBodegas'

export default function SelectorBodega({ id, etiqueta, valor, onCambiar, excluir }) {
  const bodegas = useBodegas()
  const opciones = bodegasActivas(bodegas.data).filter((b) => b.valor !== excluir)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </label>
      <select id={id} value={valor} onChange={(evento) => onCambiar(evento.target.value)} className="border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca">
        <option value="">Elija una bodega</option>
        {opciones.map((b) => (
          <option key={b.valor} value={b.valor}>
            {b.texto}
          </option>
        ))}
      </select>
    </div>
  )
}
