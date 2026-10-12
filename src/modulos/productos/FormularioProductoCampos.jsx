import { Controller, useForm, useWatch } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Casilla from '../../components/ui/Casilla'
import Selector from '../../components/ui/Selector'
import SubirImagen from '../../components/ui/SubirImagen'
import { pesos } from '../../config/formato'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { productosApi } from './api'
import CodigosBarras from './CodigosBarras'
import EditorReceta from './EditorReceta'
import SelectorTipo from './SelectorTipo'
import { CON_RECETA } from './tipos'
import UnidadesAlternas from './UnidadesAlternas'
import { useCategorias, useMarcas, useUnidades } from './useCatalogosProducto'
import { aPeticion, tarifaDe, valoresIniciales } from './valoresProducto'

export default function FormularioProductoCampos({ producto, impuestos }) {
  const { data: sesion } = useSesion()
  const navegar = useNavigate()
  const consultas = useQueryClient()
  const unidades = useUnidades()
  const categorias = useCategorias()
  const marcas = useMarcas()
  const editable = tienePermiso(sesion, 'productos:item:gestionar')
  const editaReceta = tienePermiso(sesion, 'productos:receta:gestionar')
  const { register, handleSubmit, control, formState } = useForm({ defaultValues: valoresIniciales(producto, impuestos) })
  const [tipo, unidad, impuesto, precio, incluyeImpuesto] = useWatch({ control, name: ['tipo', 'unidad', 'impuesto', 'precio', 'incluyeImpuesto'] })
  const errores = formState.errors
  const unidadElegida = (unidades.data || []).find((u) => u.codigo === unidad)
  const tarifa = tarifaDe(impuestos, impuesto)

  const guardar = useMutation({
    mutationFn: (valores) => (producto ? productosApi.actualizar(producto.codigo, aPeticion(valores, impuestos)) : productosApi.crear(aPeticion(valores, impuestos))),
    onSuccess: (datos) => {
      consultas.invalidateQueries({ queryKey: ['productos'] })
      consultas.setQueryData(['producto', datos.codigo], datos)
      if (!producto && CON_RECETA.includes(datos.tipo)) {
        navegar('/productos/' + datos.codigo, { replace: true })
        return
      }
      navegar('/productos')
    },
  })
  const foto = useMutation({
    mutationFn: (archivo) => productosApi.subirFoto(producto.codigo, archivo),
    onSuccess: () => consultas.invalidateQueries({ queryKey: ['producto', producto.codigo] }),
  })
  const estado = useMutation({
    mutationFn: () => productosApi.cambiarEstado(producto.codigo, !producto.activo),
    onSuccess: (datos) => {
      consultas.setQueryData(['producto', producto.codigo], datos)
      consultas.invalidateQueries({ queryKey: ['productos'] })
    },
  })

  const opcionesUnidad = (unidades.data || []).map((u) => ({ valor: u.codigo, texto: u.nombre + ' (' + u.simbolo + ')' }))
  const opcionesImpuesto = impuestos.map((i) => ({ valor: i.codigo, texto: i.nombre }))
  const opcionesCategoria = (categorias.data || []).filter((c) => c.activa).map((c) => ({ valor: c.codigo, texto: c.padreNombre ? c.padreNombre + ' / ' + c.nombre : c.nombre }))
  const opcionesMarca = (marcas.data || []).filter((m) => m.activa).map((m) => ({ valor: m.codigo, texto: m.nombre }))
  const precioNumero = Number(precio || 0)
  const precioSinImpuesto = incluyeImpuesto ? precioNumero / (1 + tarifa / 100) : precioNumero
  const precioFinal = incluyeImpuesto ? precioNumero : precioNumero * (1 + tarifa / 100)

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link to="/productos" className="text-sm text-marca hover:underline">
          <i className="bi bi-arrow-left" /> Volver
        </Link>
        {producto && !producto.activo && <span className="border border-borde px-2 py-0.5 text-xs text-suave">Inactivo</span>}
      </div>

      <form onSubmit={handleSubmit((valores) => guardar.mutate(valores))} noValidate className="flex flex-col gap-4">
        {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}

        <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
          <p className="font-semibold">¿Qué es?</p>
          <Controller name="tipo" control={control} render={({ field }) => <SelectorTipo valor={field.value} onCambiar={field.onChange} disabled={!editable} />} />
        </section>

        <section className="grid grid-cols-1 gap-4 border border-borde bg-superficie p-4 md:grid-cols-2">
          <Campo id="nombre" etiqueta="Nombre" disabled={!editable} error={errores.nombre && errores.nombre.message} registro={register('nombre', { validate: (v) => v.trim() !== '' || 'Escriba el nombre' })} />
          <Campo id="sku" etiqueta="Código interno" placeholder="Se genera solo si lo deja vacío" disabled={!editable} registro={register('sku')} />
          <Selector id="categoria" etiqueta="Categoría" vacio="Sin categoría" opciones={opcionesCategoria} disabled={!editable} registro={register('categoria')} />
          <Selector id="marca" etiqueta="Marca" vacio="Sin marca" opciones={opcionesMarca} disabled={!editable} registro={register('marca')} />
          <Selector id="unidad" etiqueta="Se mide en" opciones={opcionesUnidad} disabled={!editable} registro={register('unidad')} />
          {unidadElegida && unidadElegida.permiteFraccion ? (
            <Casilla id="permiteFraccion" etiqueta="Se vende en cantidades con decimales" ayuda={'Ej. 1,5 ' + unidadElegida.simbolo} disabled={!editable} registro={register('permiteFraccion')} />
          ) : (
            <span />
          )}
          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="text-sm font-medium">
              Descripción
            </label>
            <textarea id="descripcion" rows="2" disabled={!editable} {...register('descripcion')} className="mt-1 w-full border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca" />
          </div>
        </section>

        {tipo !== 'INSUMO' && (
          <section className="grid grid-cols-1 gap-4 border border-borde bg-superficie p-4 md:grid-cols-3">
            <Campo id="precio" etiqueta={'Precio de venta por ' + (unidadElegida ? unidadElegida.nombre.toLowerCase() : 'unidad')} type="number" min="0" disabled={!editable} registro={register('precio')} />
            <Selector id="impuesto" etiqueta="Impuesto" opciones={opcionesImpuesto} disabled={!editable} registro={register('impuesto')} />
            <div className="flex flex-col justify-end gap-2">
              <Casilla id="incluyeImpuesto" etiqueta="El precio ya incluye el impuesto" disabled={!editable} registro={register('incluyeImpuesto')} />
            </div>
            <p className="text-sm text-suave md:col-span-3">
              Sin impuesto: <strong className="text-texto">{pesos(precioSinImpuesto)}</strong> · Al cliente: <strong className="text-texto">{pesos(precioFinal)}</strong>
            </p>
          </section>
        )}

        <section className="flex flex-col gap-4 border border-borde bg-superficie p-4">
          <Controller name="codigosBarras" control={control} render={({ field }) => <CodigosBarras valor={field.value} onCambiar={field.onChange} disabled={!editable} />} />
          <UnidadesAlternas control={control} register={register} unidadBase={unidad} editable={editable} />
        </section>

        {editable && (
          <div className="flex flex-wrap gap-2">
            <Boton type="submit" cargando={guardar.isPending} icono="bi-check-lg">
              Guardar
            </Boton>
            {producto && (
              <Boton variante="secundario" cargando={estado.isPending} onClick={() => estado.mutate()}>
                {producto.activo ? 'Desactivar' : 'Activar'}
              </Boton>
            )}
          </div>
        )}
      </form>

      {producto && (
        <section className="flex flex-col gap-2 border border-borde bg-superficie p-4">
          <p className="font-semibold">Foto</p>
          {foto.isError && <Alerta>{foto.error.message}</Alerta>}
          <SubirImagen codigo={producto.foto} etiqueta="Cambiar foto" ayuda="PNG, JPG o WEBP, máximo 3 MB" cargando={foto.isPending} disabled={!editable} onElegir={(archivo) => foto.mutate(archivo)} />
        </section>
      )}

      {producto && CON_RECETA.includes(producto.tipo) && <EditorReceta producto={producto} editable={editaReceta} />}
      {!producto && CON_RECETA.includes(tipo) && <Alerta tipo="info">Después de guardar podrá indicar los insumos que gasta.</Alerta>}
    </div>
  )
}
