import { useTema } from '../../config/temaContexto'

export default function BotonTema() {
  const { modo, alternar } = useTema()
  const oscuro = modo === 'oscuro'

  return (
    <button
      type="button"
      onClick={alternar}
      title={oscuro ? 'Modo claro' : 'Modo oscuro'}
      className="flex h-10 w-10 items-center justify-center text-lg text-suave hover:bg-superficie-alt hover:text-texto"
    >
      <i className={'bi ' + (oscuro ? 'bi-sun' : 'bi-moon-stars')} />
    </button>
  )
}
