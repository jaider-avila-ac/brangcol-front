import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Cargando from '../../components/ui/Cargando'
import Casilla from '../../components/ui/Casilla'
import Selector from '../../components/ui/Selector'
import { empresaApi } from './api'

const APLICACION_PAGOS = [
  { valor: 'MAS_ANTIGUA', texto: 'A la factura más antigua' },
  { valor: 'MANUAL', texto: 'El usuario elige la factura' },
]

export default function ConfiguracionEmpresa({ puedeEditar }) {
  const configuracion = useQuery({ queryKey: ['configuracion'], queryFn: empresaApi.configuracion })

  if (configuracion.isPending) {
    return <Cargando />
  }
  if (configuracion.isError) {
    return <Alerta>{configuracion.error.message}</Alerta>
  }
  return <Formulario inicial={configuracion.data} puedeEditar={puedeEditar} />
}

function Formulario({ inicial, puedeEditar }) {
  const consultas = useQueryClient()
  const { register, handleSubmit } = useForm({ defaultValues: inicial })
  const guardar = useMutation({
    mutationFn: empresaApi.actualizarConfiguracion,
    onSuccess: (datos) => consultas.setQueryData(['configuracion'], datos),
  })
  const numero = { valueAsNumber: true }

  return (
    <form onSubmit={handleSubmit((valores) => guardar.mutate(valores))} noValidate className="flex flex-col gap-4">
      {guardar.isSuccess && <Alerta tipo="exito">Configuración guardada.</Alerta>}
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}

      <Seccion titulo="Cantidades y precios">
        <Campo id="decimalesCantidad" etiqueta="Decimales en cantidades (0 a 4)" type="number" min="0" max="4" disabled={!puedeEditar} registro={register('decimalesCantidad', numero)} />
        <Campo id="decimalesPrecio" etiqueta="Decimales en precios (0 a 2)" type="number" min="0" max="2" disabled={!puedeEditar} registro={register('decimalesPrecio', numero)} />
      </Seccion>

      <Seccion titulo="Inventario">
        <Casilla id="controlaInventario" etiqueta="Controlar inventario" ayuda="Las ventas y compras mueven las existencias" disabled={!puedeEditar} registro={register('controlaInventario')} />
        <Casilla id="permiteInventarioNegativo" etiqueta="Permitir vender sin existencias" ayuda="Si se desactiva, la venta se bloquea cuando no hay unidades" disabled={!puedeEditar} registro={register('permiteInventarioNegativo')} />
      </Seccion>

      <Seccion titulo="Cartera">
        <Selector id="aplicacionPagos" etiqueta="Los abonos de un cliente se aplican" opciones={APLICACION_PAGOS} disabled={!puedeEditar} registro={register('aplicacionPagos')} />
      </Seccion>

      <Seccion titulo="Seguridad">
        <Campo id="maxSesionesPorUsuario" etiqueta="Sesiones abiertas por usuario (1 a 50)" type="number" min="1" max="50" disabled={!puedeEditar} registro={register('maxSesionesPorUsuario', numero)} />
        <Campo id="minutosInactividad" etiqueta="Cerrar sesión tras minutos sin uso (5 a 1440)" type="number" min="5" max="1440" disabled={!puedeEditar} registro={register('minutosInactividad', numero)} />
      </Seccion>

      {puedeEditar && (
        <Boton type="submit" cargando={guardar.isPending} icono="bi-check-lg" className="self-start">
          Guardar
        </Boton>
      )}
    </form>
  )
}

function Seccion({ titulo, children }) {
  return (
    <section className="border border-borde bg-white p-4">
      <h2 className="mb-3 font-semibold text-marca">{titulo}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  )
}
