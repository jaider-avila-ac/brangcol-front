export default function Pestanas({ pestanas, activa, onCambiar }) {
  return (
    <div className="mb-4 flex overflow-x-auto border-b border-borde">
      {pestanas.map((pestana) => (
        <button
          key={pestana.id}
          type="button"
          onClick={() => onCambiar(pestana.id)}
          className={
            'flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm ' +
            (activa === pestana.id
              ? 'border-acento font-semibold text-marca'
              : 'border-transparent text-suave hover:text-texto')
          }
        >
          <i className={'bi ' + pestana.icono} />
          {pestana.texto}
        </button>
      ))}
    </div>
  )
}
