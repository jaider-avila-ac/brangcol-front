export default function Paginacion({ pagina, totalPaginas, total, onCambiar }) {
  if (totalPaginas <= 1) {
    return <p className="text-sm text-suave">{total} registros</p>
  }
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-suave">{total} registros</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={pagina === 0}
          onClick={() => onCambiar(pagina - 1)}
          className="border border-borde bg-superficie px-3 py-1.5 hover:bg-superficie-alt disabled:text-suave"
          aria-label="Página anterior"
        >
          <i className="bi bi-chevron-left" />
        </button>
        <span className="px-3">
          {pagina + 1} de {totalPaginas}
        </span>
        <button
          type="button"
          disabled={pagina + 1 >= totalPaginas}
          onClick={() => onCambiar(pagina + 1)}
          className="border border-borde bg-superficie px-3 py-1.5 hover:bg-superficie-alt disabled:text-suave"
          aria-label="Página siguiente"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  )
}
