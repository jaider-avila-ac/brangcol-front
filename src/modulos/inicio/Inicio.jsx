import { PESOS } from '../../components/graficas/registro'
import { indicadores } from './datosEjemplo'
import GraficaMediosPago from './GraficaMediosPago'
import GraficaVentas from './GraficaVentas'
import Kpi from './Kpi'

export default function Inicio() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-suave">Datos de ejemplo mientras se registran las primeras ventas.</p>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="order-2 flex min-w-0 flex-col gap-4 xl:order-1">
          <GraficaVentas />
          <GraficaMediosPago />
        </div>
        <aside className="order-1 grid grid-cols-1 content-start gap-3 sm:grid-cols-2 xl:order-2 xl:grid-cols-1">
          <Kpi icono="bi-receipt" titulo="Vendido hoy" valor={PESOS.format(indicadores.ventasHoy)} detalle={indicadores.facturasHoy + ' ventas'} />
          <Kpi icono="bi-wallet2" titulo="Le deben" valor={PESOS.format(indicadores.porCobrar)} color="acento" />
          <Kpi icono="bi-cash-stack" titulo="Dinero en caja" valor={PESOS.format(indicadores.enCajas)} color="exito" />
          <Kpi icono="bi-box-seam" titulo="Productos por agotarse" valor={indicadores.porAgotarse} color="peligro" />
        </aside>
      </div>
    </div>
  )
}
