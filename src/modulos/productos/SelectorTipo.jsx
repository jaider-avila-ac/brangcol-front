import { TIPOS } from './tipos'

export default function SelectorTipo({ valor, onCambiar, disabled }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {TIPOS.map((tipo) => (
        <button
          key={tipo.valor}
          type="button"
          disabled={disabled}
          onClick={() => onCambiar(tipo.valor)}
          className={
            'flex flex-col gap-1 border px-3 py-2.5 text-left ' +
            (valor === tipo.valor ? 'border-marca bg-marca text-sobre-marca' : 'border-borde bg-superficie hover:border-marca')
          }
        >
          <span className="text-sm font-semibold">{tipo.texto}</span>
          <span className={'text-xs ' + (valor === tipo.valor ? '' : 'text-suave')}>{tipo.ayuda}</span>
        </button>
      ))}
    </div>
  )
}
