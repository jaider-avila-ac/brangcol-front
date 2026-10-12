export default function Titulo({ children, descripcion }) {
  return (
    <div className="mb-5 border-b border-borde pb-3">
      <h1 className="text-xl font-semibold text-marca">{children}</h1>
      {descripcion && <p className="mt-1 text-sm text-suave">{descripcion}</p>}
    </div>
  )
}
