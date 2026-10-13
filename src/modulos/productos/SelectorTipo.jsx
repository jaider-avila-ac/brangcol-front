import { TIPOS, tipoVisible } from './tipos'

export default function SelectorTipo({ valor, onCambiar, disabled }) {
  const marcado = tipoVisible(valor)

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {TIPOS.map((tipo) => (
        <button
          key={tipo.valor}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (marcado !== tipo.valor) {
              onCambiar(tipo.valor)
            }
          }}
          className={
            'flex flex-col gap-1 border px-3 py-2.5 text-left ' +
            (marcado === tipo.valor ? 'border-marca bg-marca text-sobre-marca' : 'border-borde bg-superficie hover:border-marca')
          }
        >
          <span className="text-sm font-semibold">{tipo.texto}</span>
          <span className={'text-xs ' + (marcado === tipo.valor ? '' : 'text-suave')}>{tipo.ayuda}</span>
        </button>
      ))}
    </div>
  )
}
