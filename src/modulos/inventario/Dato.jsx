export default function Dato({ etiqueta, valor }) {
  return (
    <div>
      <p className="text-xs text-suave">{etiqueta}</p>
      <p className="text-sm font-medium">{valor}</p>
    </div>
  )
}
