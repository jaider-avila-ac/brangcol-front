import { Link } from 'react-router'

export default function NoEncontrado() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <i className="bi bi-signpost-split text-4xl text-suave" />
      <h1 className="text-xl font-semibold text-marca">Página no encontrada</h1>
      <Link to="/" className="bg-marca px-4 py-2 text-sm text-white hover:bg-marca-oscuro">
        Ir al inicio
      </Link>
    </div>
  )
}
