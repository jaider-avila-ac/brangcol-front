const COLORES = {
  marca: 'bg-marca text-sobre-marca',
  acento: 'bg-acento text-sobre-acento',
  exito: 'bg-exito text-superficie',
  peligro: 'bg-peligro text-superficie',
  aviso: 'bg-aviso text-superficie',
}

export default function Kpi({ icono, titulo, valor, detalle, color = 'marca' }) {
  return (
    <div className="flex items-center gap-4 border border-borde bg-superficie p-4">
      <div className={'flex h-12 w-12 shrink-0 items-center justify-center text-xl ' + COLORES[color]}>
        <i className={'bi ' + icono} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-suave">{titulo}</p>
        <p className="truncate text-xl font-bold text-texto">{valor}</p>
        {detalle && <p className="truncate text-xs text-suave">{detalle}</p>}
      </div>
    </div>
  )
}
