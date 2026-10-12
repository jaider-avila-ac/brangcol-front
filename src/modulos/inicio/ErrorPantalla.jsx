export default function ErrorPantalla() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <i className="bi bi-exclamation-octagon text-4xl text-marca" />
      <h1 className="text-xl font-semibold text-marca">Algo salió mal</h1>
      <p className="text-sm text-suave">El error fue reportado. Recargue la página para continuar.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="bg-marca px-4 py-2 text-sm text-sobre-marca hover:bg-marca-hover"
      >
        Recargar
      </button>
    </div>
  )
}
