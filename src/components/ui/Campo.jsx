export default function Campo({ etiqueta, error, registro, id, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-texto">
        {etiqueta}
      </label>
      <input
        id={id}
        className={
          'border bg-superficie px-3 py-2 text-sm outline-none focus:border-marca ' +
          (error ? 'border-marca' : 'border-borde')
        }
        {...registro}
        {...props}
      />
      {error && <span className="text-xs text-marca">{error}</span>}
    </div>
  )
}
