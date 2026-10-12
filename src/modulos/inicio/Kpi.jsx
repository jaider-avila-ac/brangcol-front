export default function Kpi({ icono, titulo, valor, detalle }) {
  return (
    <div className="flex items-center gap-4 border border-borde bg-superficie p-4">
      <i className={'bi text-2xl text-marca ' + icono} />
      <div className="min-w-0">
        <p className="text-sm text-suave">{titulo}</p>
        <p className="truncate text-xl font-semibold text-texto">{valor}</p>
        {detalle && <p className="truncate text-xs text-suave">{detalle}</p>}
      </div>
    </div>
  )
}
