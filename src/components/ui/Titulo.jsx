// El nombre de la pantalla ya esta en el encabezado; aqui solo va la frase que la explica
export default function Titulo({ children, descripcion }) {
  return <p className="mb-4 text-sm text-suave">{descripcion || children}</p>
}
