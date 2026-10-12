const TIPOS = {
  error: { clase: 'border-l-peligro text-peligro', icono: 'bi-exclamation-circle' },
  exito: { clase: 'border-l-exito text-exito', icono: 'bi-check-circle' },
  info: { clase: 'border-l-marca text-marca', icono: 'bi-info-circle' },
}

export default function Alerta({ tipo = 'error', children }) {
  const estilo = TIPOS[tipo]
  return (
    <div className={'flex items-start gap-2 border border-l-4 border-borde bg-superficie px-3 py-2 text-sm ' + estilo.clase} role="alert">
      <i className={'bi mt-0.5 ' + estilo.icono} />
      <span>{children}</span>
    </div>
  )
}
