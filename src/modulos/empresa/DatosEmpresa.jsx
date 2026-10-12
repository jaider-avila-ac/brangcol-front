import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Cargando from '../../components/ui/Cargando'
import Casilla from '../../components/ui/Casilla'
import { CLAVE_SESION } from '../auth/useSesion'
import { empresaApi } from './api'
import LogoEmpresa from './LogoEmpresa'
import SelectorMunicipio from './SelectorMunicipio'

export default function DatosEmpresa({ puedeEditar }) {
  const empresa = useQuery({ queryKey: ['empresa'], queryFn: empresaApi.obtener })

  if (empresa.isPending) {
    return <Cargando />
  }
  if (empresa.isError) {
    return <Alerta>{empresa.error.message}</Alerta>
  }
  return <Formulario empresa={empresa.data} puedeEditar={puedeEditar} />
}

function Formulario({ empresa, puedeEditar }) {
  const consultas = useQueryClient()
  const { register, handleSubmit, control, formState } = useForm({
    defaultValues: {
      razonSocial: empresa.razonSocial,
      nombreComercial: empresa.nombreComercial || '',
      responsableIva: empresa.responsableIva,
      direccion: empresa.direccion,
      municipio: empresa.municipio.codigo,
      telefono: empresa.telefono || '',
      correo: empresa.correo,
    },
  })
  const guardar = useMutation({
    mutationFn: empresaApi.actualizar,
    onSuccess: (datos) => {
      consultas.setQueryData(['empresa'], datos)
      consultas.invalidateQueries({ queryKey: CLAVE_SESION })
    },
  })
  const errores = formState.errors
  const documento = empresa.numeroDocumento + (empresa.dv ? '-' + empresa.dv : '')

  return (
    <form onSubmit={handleSubmit((valores) => guardar.mutate(valores))} noValidate className="flex flex-col gap-4">
      {guardar.isSuccess && <Alerta tipo="exito">Datos guardados.</Alerta>}
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}

      <LogoEmpresa puedeEditar={puedeEditar} />

      <section className="grid grid-cols-1 gap-4 border border-borde bg-superficie p-4 md:grid-cols-2">
        <Dato etiqueta={empresa.tipoDocumento} valor={documento} />
        <Dato etiqueta="Estado" valor={empresa.estado === 'ACTIVA' ? 'Activa' : empresa.estado} />
        <Campo
          id="razonSocial"
          etiqueta="Razón social"
          disabled={!puedeEditar}
          error={errores.razonSocial && errores.razonSocial.message}
          registro={register('razonSocial', { required: 'La razón social es obligatoria' })}
        />
        <Campo id="nombreComercial" etiqueta="Nombre comercial" disabled={!puedeEditar} registro={register('nombreComercial')} />
        <Campo
          id="direccion"
          etiqueta="Dirección"
          disabled={!puedeEditar}
          error={errores.direccion && errores.direccion.message}
          registro={register('direccion', { required: 'La dirección es obligatoria' })}
        />
        <Controller
          name="municipio"
          control={control}
          rules={{ required: 'Elija un municipio de la lista' }}
          render={({ field, fieldState }) => (
            <SelectorMunicipio
              id="municipio"
              etiqueta="Municipio"
              valor={field.value}
              nombre={empresa.municipio.nombre + ' (' + empresa.municipio.departamento + ')'}
              onCambiar={field.onChange}
              disabled={!puedeEditar}
              error={fieldState.error && fieldState.error.message}
            />
          )}
        />
        <Campo id="telefono" etiqueta="Teléfono" disabled={!puedeEditar} registro={register('telefono')} />
        <Campo
          id="correo"
          etiqueta="Correo"
          type="email"
          disabled={!puedeEditar}
          error={errores.correo && errores.correo.message}
          registro={register('correo', { required: 'El correo es obligatorio' })}
        />
        <Casilla id="responsableIva" etiqueta="Responsable de IVA" disabled={!puedeEditar} registro={register('responsableIva')} />
      </section>

      {puedeEditar && (
        <Boton type="submit" cargando={guardar.isPending} icono="bi-check-lg" className="self-start">
          Guardar
        </Boton>
      )}
    </form>
  )
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-texto">{etiqueta}</span>
      <span className="border border-borde bg-fondo px-3 py-2 text-sm">{valor}</span>
    </div>
  )
}
