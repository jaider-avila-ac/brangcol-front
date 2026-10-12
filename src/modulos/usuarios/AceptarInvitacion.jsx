import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Cargando from '../../components/ui/Cargando'
import { usuariosApi } from './api'

const POLITICA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,72}$/

export default function AceptarInvitacion() {
  const [token] = useState(() => window.location.hash.substring(1))
  const invitacion = useQuery({
    queryKey: ['invitacion', token],
    queryFn: () => usuariosApi.consultarInvitacion(token),
    enabled: token.length > 0,
    retry: false,
  })

  let contenido
  if (!token) {
    contenido = <Alerta>El enlace no es válido. Pida una nueva invitación.</Alerta>
  } else if (invitacion.isPending) {
    contenido = <Cargando />
  } else if (invitacion.isError) {
    contenido = <Alerta>{invitacion.error.message}</Alerta>
  } else {
    contenido = <Formulario token={token} invitacion={invitacion.data} />
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-fondo p-4">
      <div className="w-full max-w-md border border-borde bg-white">
        <div className="bg-marca px-6 py-5 text-white">
          <h1 className="text-xl font-semibold">BrangCol</h1>
          <p className="text-sm text-marca-claro">Invitación</p>
        </div>
        <div className="flex flex-col gap-4 p-6">{contenido}</div>
      </div>
    </div>
  )
}

function Formulario({ token, invitacion }) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { nombres: '', apellidos: '', contrasena: '', confirmacion: '' },
  })
  const aceptar = useMutation({ mutationFn: usuariosApi.aceptarInvitacion })
  const errores = formState.errors

  if (aceptar.isSuccess) {
    return (
      <>
        <Alerta tipo="exito">Listo. Ya puede entrar a {invitacion.empresa} con su correo y contraseña.</Alerta>
        <Link to="/login" className="bg-marca px-4 py-2 text-center text-sm text-white hover:bg-marca-oscuro">
          Iniciar sesión
        </Link>
      </>
    )
  }

  function enviar(valores) {
    aceptar.mutate({ token, nombres: valores.nombres, apellidos: valores.apellidos, contrasena: valores.contrasena })
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="flex flex-col gap-4">
      <p className="text-sm">
        Lo invitaron a <strong>{invitacion.empresa}</strong> con el rol <strong>{invitacion.rol}</strong>. Su usuario
        será <strong className="break-all">{invitacion.correo}</strong>.
      </p>
      {aceptar.isError && <Alerta>{aceptar.error.message}</Alerta>}

      {invitacion.tieneCuenta ? (
        <Campo
          id="contrasena"
          etiqueta="Su contraseña actual de BrangCol"
          type="password"
          autoComplete="current-password"
          error={errores.contrasena && errores.contrasena.message}
          registro={register('contrasena', { required: 'Escriba su contraseña' })}
        />
      ) : (
        <>
          <Campo
            id="nombres"
            etiqueta="Nombres"
            autoComplete="given-name"
            error={errores.nombres && errores.nombres.message}
            registro={register('nombres', { required: 'Escriba su nombre' })}
          />
          <Campo id="apellidos" etiqueta="Apellidos" autoComplete="family-name" registro={register('apellidos')} />
          <Campo
            id="contrasena"
            etiqueta="Contraseña"
            type="password"
            autoComplete="new-password"
            error={errores.contrasena && errores.contrasena.message}
            registro={register('contrasena', {
              required: 'Escriba una contraseña',
              pattern: { value: POLITICA, message: 'Entre 10 y 72 caracteres, con mayúscula, minúscula y número' },
            })}
          />
          <Campo
            id="confirmacion"
            etiqueta="Repita la contraseña"
            type="password"
            autoComplete="new-password"
            error={errores.confirmacion && errores.confirmacion.message}
            registro={register('confirmacion', {
              validate: (valor, valores) => valor === valores.contrasena || 'Las contraseñas no coinciden',
            })}
          />
        </>
      )}
      <Boton type="submit" cargando={aceptar.isPending} icono="bi-check-lg" className="w-full">
        Aceptar invitación
      </Boton>
    </form>
  )
}
