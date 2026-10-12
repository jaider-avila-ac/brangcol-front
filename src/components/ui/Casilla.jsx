export default function Casilla({ etiqueta, ayuda, registro, id, ...props }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-sm">
      <input id={id} type="checkbox" className="mt-0.5 h-4 w-4 accent-marca" {...registro} {...props} />
      <span>
        <span className="block font-medium">{etiqueta}</span>
        {ayuda && <span className="block text-xs text-suave">{ayuda}</span>}
      </span>
    </label>
  )
}
