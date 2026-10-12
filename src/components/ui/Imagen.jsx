import { RUTA_API } from '../../api/cliente'

export default function Imagen({ codigo, alt, className = 'h-10 w-10', icono = 'bi-image' }) {
  if (!codigo) {
    return (
      <span className={'flex shrink-0 items-center justify-center bg-superficie-alt text-suave ' + className}>
        <i className={'bi ' + icono} />
      </span>
    )
  }
  return <img src={RUTA_API + '/archivos/' + codigo} alt={alt} className={'shrink-0 object-cover ' + className} />
}
