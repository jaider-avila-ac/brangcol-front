import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import { authApi } from './api'

const POLITICA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,72}$/

export default function CambiarContrasena() {
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { actual: '', nueva: '', confirmacion: '' },
  })
  const consultas = useQueryClient()
  const cambio = useMutation({
    mutationFn: authApi.cambiarContrasena,
    onSuccess: () => {
      reset()
      consultas.invalidateQueries({ queryKey: ['sesiones'] })
    },
  })
  const errores = formState.errors

  function enviar(valores) {
    cambio.mutate({ actual: valores.actual, nueva: valores.nueva })
  }

  return (
    <section className="border border-borde bg-superficie p-4">
      <h2 className="mb-3 font-semibold text-marca">Cambiar contraseña</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(enviar)} noValidate>
        {cambio.isSuccess && (
          <Alerta tipo="exito">Contraseña cambiada. Se cerraron sus sesiones en otros dispositivos.</Alerta>
        )}
        {cambio.isError && <Alerta>{cambio.error.message}</Alerta>}
        <Campo
          id="actual"
          etiqueta="Contraseña actual"
          type="password"
          autoComplete="current-password"
          error={errores.actual && errores.actual.message}
          registro={register('actual', { required: 'Escriba su contraseña actual' })}
        />
        <Campo
          id="nueva"
          etiqueta="Contraseña nueva"
          type="password"
          autoComplete="new-password"
          error={errores.nueva && errores.nueva.message}
          registro={register('nueva', {
            required: 'Escriba la contraseña nueva',
            pattern: { value: POLITICA, message: 'Entre 10 y 72 caracteres, con mayúscula, minúscula y número' },
          })}
        />
        <Campo
          id="confirmacion"
          etiqueta="Repita la contraseña nueva"
          type="password"
          autoComplete="new-password"
          error={errores.confirmacion && errores.confirmacion.message}
          registro={register('confirmacion', {
            validate: (valor, valores) => valor === valores.nueva || 'Las contraseñas no coinciden',
          })}
        />
        <Boton type="submit" cargando={cambio.isPending} icono="bi-key" className="self-start">
          Cambiar contraseña
        </Boton>
      </form>
    </section>
  )
}
