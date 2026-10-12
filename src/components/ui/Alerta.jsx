const TIPOS = {
  error: { clase: 'border-peligro bg-red-50 text-peligro', icono: 'bi-exclamation-circle' },
  exito: { clase: 'border-exito bg-green-50 text-exito', icono: 'bi-check-circle' },
  info: { clase: 'border-marca bg-marca-claro text-marca', icono: 'bi-info-circle' },
}

export default function Alerta({ tipo = 'error', children }) {
  const estilo = TIPOS[tipo]
  return (
    <div className={'flex items-start gap-2 border-l-4 px-3 py-2 text-sm ' + estilo.clase} role="alert">
      <i className={'bi mt-0.5 ' + estilo.icono} />
      <span>{children}</span>
    </div>
  )
}
