import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Casilla from '../../components/ui/Casilla'
import Selector from '../../components/ui/Selector'
import { pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import SelectorMunicipio from '../empresa/SelectorMunicipio'
import { tercerosApi } from './api'
import CondicionesCliente from './CondicionesCliente'
import CondicionesProveedor from './CondicionesProveedor'
import { useTiposDocumento } from './useCatalogos'
import { aPeticion, valoresIniciales } from './valoresFormulario'

export default function FormularioTerceroCampos({ tercero }) {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const consultas = useQueryClient()
  const tipos = useTiposDocumento()
  const [coincidencia, setCoincidencia] = useState(null)
  const editable = tienePermiso(sesion, tercero ? 'terceros:tercero:editar' : 'terceros:tercero:crear')
  const { register, handleSubmit, control, getValues, formState } = useForm({ defaultValues: valoresIniciales(tercero) })
  const tipoPersona = useWatch({ control, name: 'tipoPersona' })
  const esCliente = useWatch({ control, name: 'esCliente' })
  const esProveedor = useWatch({ control, name: 'esProveedor' })
  const errores = formState.errors

  const guardar = useMutation({
    mutationFn: (valores) =>
      tercero ? tercerosApi.actualizar(tercero.codigo, aPeticion(valores, tercero)) : tercerosApi.crear(aPeticion(valores, null)),
    onSuccess: () => {
      consultas.invalidateQueries({ queryKey: ['terceros'] })
      consultas.invalidateQueries({ queryKey: ['tercero'] })
      navegar('/terceros')
    },
  })
  const estado = useMutation({
    mutationFn: () => tercerosApi.cambiarEstado(tercero.codigo, !tercero.activo),
    onSuccess: (datos) => {
      consultas.setQueryData(['tercero', tercero.codigo], datos)
      consultas.invalidateQueries({ queryKey: ['terceros'] })
    },
  })

  async function revisarDocumento() {
    const { tipoDocumento, numeroDocumento } = getValues()
    if (tercero || !numeroDocumento.trim()) {
      setCoincidencia(null)
      return
    }
    setCoincidencia(await tercerosApi.porDocumento(tipoDocumento, numeroDocumento))
  }

  const opcionesTipo = (tipos.data || [])
    .filter((tipo) => tipoPersona === 'NATURAL' || tipo.aplicaA !== 'NATURAL')
    .map((tipo) => ({ valor: tipo.codigo, texto: tipo.abreviatura + ' - ' + tipo.nombre }))

  return (
    <form onSubmit={handleSubmit((valores) => guardar.mutate(valores))} noValidate className="flex max-w-5xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link to="/terceros" className="text-sm text-marca hover:underline">
          <i className="bi bi-arrow-left" /> Volver
        </Link>
        {tercero && !tercero.activo && <span className="border border-borde px-2 py-0.5 text-xs text-suave">Inactivo</span>}
      </div>

      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}
      {coincidencia && (
        <Alerta tipo="info">
          {coincidencia.nombre} ya está registrado con ese documento.{' '}
          <Link to={'/terceros/' + coincidencia.codigo} className="font-semibold underline">
            Abrirlo
          </Link>{' '}
          para marcarlo también como {coincidencia.esCliente ? 'proveedor' : 'cliente'}.
        </Alerta>
      )}

      {tercero && tercero.cliente && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Resumen titulo="Le debe" valor={pesos(tercero.debe)} />
          <Resumen titulo="Saldo a favor" valor={pesos(tercero.saldoFavor)} />
          {tercero.proveedor && <Resumen titulo="Le debemos" valor={pesos(tercero.leDebemos)} />}
        </div>
      )}

      <section className="flex flex-col gap-4 border border-borde bg-superficie p-4">
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" value="NATURAL" disabled={!editable} {...register('tipoPersona')} className="accent-marca" />
            Persona
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="JURIDICA" disabled={!editable} {...register('tipoPersona')} className="accent-marca" />
            Empresa
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Selector id="tipoDocumento" etiqueta="Tipo de documento" opciones={opcionesTipo} disabled={!editable} registro={register('tipoDocumento')} />
          <Campo id="numeroDocumento" etiqueta="Número de documento" disabled={!editable} registro={register('numeroDocumento', { onBlur: revisarDocumento })} />
          {tipoPersona === 'JURIDICA' ? (
            <Campo
              id="razonSocial"
              etiqueta="Razón social"
              disabled={!editable}
              error={errores.razonSocial && errores.razonSocial.message}
              registro={register('razonSocial', { validate: (valor, valores) => valores.tipoPersona !== 'JURIDICA' || valor.trim() !== '' || 'Escriba la razón social' })}
            />
          ) : (
            <>
              <Campo
                id="nombres"
                etiqueta="Nombres"
                disabled={!editable}
                error={errores.nombres && errores.nombres.message}
                registro={register('nombres', { validate: (valor, valores) => valores.tipoPersona !== 'NATURAL' || valor.trim() !== '' || 'Escriba el nombre' })}
              />
              <Campo id="apellidos" etiqueta="Apellidos" disabled={!editable} registro={register('apellidos')} />
            </>
          )}
          <Campo id="nombreComercial" etiqueta="Nombre comercial" disabled={!editable} registro={register('nombreComercial')} />
          <Campo id="telefono" etiqueta="Teléfono" disabled={!editable} registro={register('telefono')} />
          <Campo id="correo" etiqueta="Correo" type="email" disabled={!editable} registro={register('correo')} />
          <Campo id="direccion" etiqueta="Dirección" disabled={!editable} registro={register('direccion')} />
          <Controller
            name="municipio"
            control={control}
            render={({ field }) => (
              <SelectorMunicipio
                id="municipio"
                etiqueta="Municipio"
                valor={field.value}
                nombre={tercero && tercero.municipio ? tercero.municipio.nombre : ''}
                onCambiar={field.onChange}
                disabled={!editable}
              />
            )}
          />
          <Casilla id="responsableIva" etiqueta="Responsable de IVA" disabled={!editable} registro={register('responsableIva')} />
        </div>
      </section>

      <section className="flex flex-col gap-4 border border-borde bg-superficie p-4">
        <div className="flex flex-wrap gap-6">
          <Casilla
            id="esCliente"
            etiqueta="Es cliente"
            ayuda={tercero && tercero.cliente ? 'Ya es cliente' : 'Le vende'}
            disabled={!editable || Boolean(tercero && tercero.cliente)}
            registro={register('esCliente')}
          />
          <Casilla
            id="esProveedor"
            etiqueta="Es proveedor"
            ayuda={tercero && tercero.proveedor ? 'Ya es proveedor' : 'Le compra'}
            disabled={!editable || Boolean(tercero && tercero.proveedor)}
            registro={register('esProveedor')}
          />
        </div>
        {esCliente && <CondicionesCliente register={register} editable={editable} />}
        {esProveedor && <CondicionesProveedor register={register} editable={editable} />}
      </section>

      <section className="border border-borde bg-superficie p-4">
        <label htmlFor="notas" className="text-sm font-medium">
          Notas
        </label>
        <textarea id="notas" rows="3" disabled={!editable} {...register('notas')} className="mt-1 w-full border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca" />
      </section>

      {editable && (
        <div className="flex flex-wrap gap-2">
          <Boton type="submit" cargando={guardar.isPending} icono="bi-check-lg">
            Guardar
          </Boton>
          {tercero && (
            <Boton variante="secundario" cargando={estado.isPending} onClick={() => estado.mutate()}>
              {tercero.activo ? 'Desactivar' : 'Activar'}
            </Boton>
          )}
        </div>
      )}
    </form>
  )
}

function Resumen({ titulo, valor }) {
  return (
    <div className="border border-borde bg-superficie px-4 py-3">
      <p className="text-sm text-suave">{titulo}</p>
      <p className="text-lg font-semibold">{valor}</p>
    </div>
  )
}
