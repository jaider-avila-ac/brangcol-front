import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Selector from '../../components/ui/Selector'
import { usuariosApi } from './api'
import { opcionesDeRoles, useRoles } from './useRoles'

export default function FormularioInvitacion({ onCreada }) {
  const roles = useRoles()
  const { register, handleSubmit, reset, formState } = useForm({ defaultValues: { correo: '', rol: '' } })
  const invitar = useMutation({
    mutationFn: usuariosApi.invitar,
    onSuccess: (invitacion) => {
      reset()
      onCreada(invitacion)
    },
  })
  const errores = formState.errors

  return (
    <section className="border border-borde bg-superficie p-4">
      <h2 className="mb-3 font-semibold text-marca">Invitar a una persona</h2>
      <form onSubmit={handleSubmit((valores) => invitar.mutate(valores))} noValidate className="flex flex-col gap-3">
        {invitar.isError && <Alerta>{invitar.error.message}</Alerta>}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Campo
            id="invitar-correo"
            etiqueta="Correo"
            type="email"
            error={errores.correo && errores.correo.message}
            registro={register('correo', { required: 'Escriba el correo' })}
          />
          <Selector
            id="invitar-rol"
            etiqueta="Rol"
            vacio="Elija un rol"
            opciones={opcionesDeRoles(roles.data)}
            error={errores.rol && errores.rol.message}
            registro={register('rol', { required: 'Elija un rol' })}
          />
        </div>
        <Boton type="submit" cargando={invitar.isPending} icono="bi-send" className="self-start">
          Enviar invitación
        </Boton>
      </form>
    </section>
  )
}
