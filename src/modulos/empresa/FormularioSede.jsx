import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Casilla from '../../components/ui/Casilla'
import { empresaApi } from './api'
import SelectorMunicipio from './SelectorMunicipio'

export default function FormularioSede({ sede, onCerrar }) {
  const consultas = useQueryClient()
  const { register, handleSubmit, control, formState } = useForm({
    defaultValues: {
      nombre: sede ? sede.nombre : '',
      direccion: sede ? sede.direccion : '',
      municipio: sede ? sede.municipio.codigo : '',
      telefono: sede ? sede.telefono || '' : '',
      activa: sede ? sede.activa : true,
    },
  })
  const guardar = useMutation({
    mutationFn: (datos) => (sede ? empresaApi.actualizarSede(sede.codigo, datos) : empresaApi.crearSede(datos)),
    onSuccess: () => {
      consultas.invalidateQueries({ queryKey: ['sedes'] })
      onCerrar()
    },
  })
  const errores = formState.errors

  return (
    <form
      onSubmit={handleSubmit((valores) => guardar.mutate(valores))}
      noValidate
      className="flex flex-col gap-4 border border-borde bg-superficie p-4"
    >
      <h2 className="font-semibold text-marca">{sede ? 'Editar sede' : 'Nueva sede'}</h2>
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Campo
          id="sede-nombre"
          etiqueta="Nombre"
          error={errores.nombre && errores.nombre.message}
          registro={register('nombre', { required: 'El nombre es obligatorio' })}
        />
        <Campo
          id="sede-direccion"
          etiqueta="Dirección"
          error={errores.direccion && errores.direccion.message}
          registro={register('direccion', { required: 'La dirección es obligatoria' })}
        />
        <Controller
          name="municipio"
          control={control}
          rules={{ required: 'Elija un municipio de la lista' }}
          render={({ field, fieldState }) => (
            <SelectorMunicipio
              id="sede-municipio"
              etiqueta="Municipio"
              valor={field.value}
              nombre={sede ? sede.municipio.nombre : ''}
              onCambiar={field.onChange}
              error={fieldState.error && fieldState.error.message}
            />
          )}
        />
        <Campo id="sede-telefono" etiqueta="Teléfono" registro={register('telefono')} />
        {!(sede && sede.esPrincipal) && <Casilla id="sede-activa" etiqueta="Sede activa" registro={register('activa')} />}
      </div>
      <div className="flex gap-2">
        <Boton type="submit" cargando={guardar.isPending} icono="bi-check-lg">
          Guardar
        </Boton>
        <Boton variante="secundario" onClick={onCerrar}>
          Cancelar
        </Boton>
      </div>
    </form>
  )
}
