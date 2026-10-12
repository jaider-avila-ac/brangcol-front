const VARIANTES = {
  primario: 'bg-marca text-sobre-marca hover:bg-marca-hover disabled:bg-suave',
  secundario: 'border border-borde bg-superficie text-texto hover:bg-superficie-alt disabled:text-suave',
}

export default function Boton({ variante = 'primario', cargando = false, icono, children, className = '', ...props }) {
  return (
    <button
      type="button"
      disabled={cargando || props.disabled}
      className={
        'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed ' +
        VARIANTES[variante] +
        ' ' +
        className
      }
      {...props}
    >
      {cargando ? <i className="bi bi-arrow-repeat animate-spin" /> : icono && <i className={'bi ' + icono} />}
      {children}
    </button>
  )
}
