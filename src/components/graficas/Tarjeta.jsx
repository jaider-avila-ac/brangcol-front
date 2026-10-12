export default function Tarjeta({ titulo, descripcion, alto = 'h-80', children }) {
  return (
    <section className="flex flex-col border border-borde bg-superficie">
      <div className="border-b border-borde px-5 py-3">
        <h2 className="font-semibold text-texto">{titulo}</h2>
        {descripcion && <p className="text-xs text-suave">{descripcion}</p>}
      </div>
      <div className={'p-4 ' + alto}>{children}</div>
    </section>
  )
}
