export default function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="flex h-full items-center justify-center gap-2 p-6 text-sm text-suave">
      <i className="bi bi-arrow-repeat animate-spin text-lg" />
      {texto}
    </div>
  )
}
