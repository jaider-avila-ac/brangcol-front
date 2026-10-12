export default function Selector({ etiqueta, error, registro, id, opciones, vacio, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {etiqueta && (
        <label htmlFor={id} className="text-sm font-medium text-texto">
          {etiqueta}
        </label>
      )}
      <select
        id={id}
        className={
          'border bg-superficie px-3 py-2 text-sm outline-none focus:border-marca ' + (error ? 'border-marca' : 'border-borde')
        }
        {...registro}
        {...props}
      >
        {vacio && <option value="">{vacio}</option>}
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-marca">{error}</span>}
    </div>
  )
}
