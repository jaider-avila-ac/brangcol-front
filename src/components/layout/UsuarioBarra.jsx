import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import { RUTA_API } from '../../api/cliente'
import { authApi } from '../../modulos/auth/api'
import { useSesion } from '../../modulos/auth/useSesion'

function iniciales(persona) {
  const nombre = (persona.nombres || '').trim()
  const apellido = (persona.apellidos || '').trim()
  return ((nombre[0] || '') + (apellido[0] || '')).toUpperCase() || 'U'
}

export default function UsuarioBarra() {
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const navegar = useNavigate()

  async function salir() {
    try {
      await authApi.salir()
    } finally {
      consultas.clear()
      navegar('/login', { replace: true })
    }
  }

  if (!sesion) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/mi-cuenta" title="Mi cuenta" className="flex items-center gap-3 px-1 py-1 hover:bg-superficie-alt">
        {sesion.foto ? (
          <img src={RUTA_API + '/archivos/' + sesion.foto} alt="Foto" className="h-9 w-9 object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center bg-marca text-sm font-bold text-sobre-marca">
            {iniciales(sesion.persona)}
          </span>
        )}
        <span className="hidden leading-tight lg:block">
          <span className="block max-w-44 truncate text-sm font-semibold text-texto">
            {[sesion.persona.nombres, sesion.persona.apellidos].filter(Boolean).join(' ')}
          </span>
          <span className="block max-w-44 truncate text-xs text-suave">{sesion.rol.nombre}</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={salir}
        title="Cerrar sesión"
        className="flex h-10 w-10 items-center justify-center text-lg text-suave hover:bg-superficie-alt hover:text-marca"
      >
        <i className="bi bi-box-arrow-right" />
      </button>
    </div>
  )
}
