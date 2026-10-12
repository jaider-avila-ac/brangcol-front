import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import { authApi } from './api'
import { CLAVE_SESION } from './useSesion'

export default function Login() {
  const { register, handleSubmit, getValues, formState } = useForm({ defaultValues: { correo: '', contrasena: '' } })
  const [error, setError] = useState(null)
  const [empresas, setEmpresas] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const consultas = useQueryClient()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const vencida = ubicacion.state && ubicacion.state.vencida

  async function entrar(empresa) {
    setError(null)
    setEnviando(true)
    const credenciales = getValues()
    try {
      const respuesta = await authApi.login({ ...credenciales, empresa: empresa || null })
      if (respuesta.estado === 'ELEGIR_EMPRESA') {
        setEmpresas(await authApi.empresas(credenciales))
        return
      }
      await consultas.invalidateQueries({ queryKey: CLAVE_SESION })
      const destino = (ubicacion.state && ubicacion.state.desde) || '/'
      navegar(destino, { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-fondo p-4">
      <div className="w-full max-w-sm border border-borde bg-white">
        <div className="bg-marca px-6 py-5 text-white">
          <h1 className="text-xl font-semibold">BrangCol</h1>
          <p className="text-sm text-marca-claro">Inicie sesión para continuar</p>
        </div>

        <div className="flex flex-col gap-4 p-6">
          {vencida && !error && <Alerta tipo="info">Su sesión terminó. Inicie sesión de nuevo.</Alerta>}
          {error && <Alerta>{error}</Alerta>}

          {empresas ? (
            <ElegirEmpresa empresas={empresas} enviando={enviando} onElegir={entrar} onVolver={() => setEmpresas(null)} />
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(() => entrar(null))} noValidate>
              <Campo
                id="correo"
                etiqueta="Correo"
                type="email"
                autoComplete="username"
                autoFocus
                error={formState.errors.correo && formState.errors.correo.message}
                registro={register('correo', { required: 'Escriba su correo' })}
              />
              <Campo
                id="contrasena"
                etiqueta="Contraseña"
                type="password"
                autoComplete="current-password"
                error={formState.errors.contrasena && formState.errors.contrasena.message}
                registro={register('contrasena', { required: 'Escriba su contraseña' })}
              />
              <Boton type="submit" cargando={enviando} icono="bi-box-arrow-in-right" className="mt-2 w-full">
                Entrar
              </Boton>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ElegirEmpresa({ empresas, enviando, onElegir, onVolver }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-suave">Usted pertenece a varias empresas. Elija con cuál quiere entrar.</p>
      <ul className="flex flex-col border border-borde">
        {empresas.map((empresa) => (
          <li key={empresa.codigo} className="border-b border-borde last:border-b-0">
            <button
              type="button"
              disabled={enviando}
              onClick={() => onElegir(empresa.codigo)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-marca-claro"
            >
              <span>
                <span className="block text-sm font-medium">{empresa.razonSocial}</span>
                <span className="block text-xs text-suave">{empresa.rol}</span>
              </span>
              <i className="bi bi-chevron-right text-suave" />
            </button>
          </li>
        ))}
      </ul>
      <Boton variante="secundario" onClick={onVolver} icono="bi-arrow-left">
        Volver
      </Boton>
    </div>
  )
}
