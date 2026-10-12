const ICONOS = {
  error: 'bi-exclamation-circle',
  exito: 'bi-check-circle',
  info: 'bi-info-circle',
}

export default function Alerta({ tipo = 'error', children }) {
  return (
    <div className="flex items-start gap-2 border border-l-4 border-borde border-l-marca bg-superficie px-3 py-2 text-sm text-texto" role="alert">
      <i className={'bi mt-0.5 text-marca ' + ICONOS[tipo]} />
      <span>{children}</span>
    </div>
  )
}
