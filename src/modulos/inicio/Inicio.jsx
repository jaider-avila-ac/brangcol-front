import Alerta from '../../components/ui/Alerta'
import { PESOS } from '../../components/graficas/registro'
import { indicadores } from './datosEjemplo'
import GraficaMasVendidos from './GraficaMasVendidos'
import GraficaMediosPago from './GraficaMediosPago'
import GraficaVentas from './GraficaVentas'
import Kpi from './Kpi'

export default function Inicio() {
  return (
    <div className="flex flex-col gap-4">
      <Alerta tipo="info">Datos de ejemplo: el tablero se conecta a la información real en la fase de reportes.</Alerta>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="order-2 flex min-w-0 flex-col gap-4 xl:order-1">
          <GraficaVentas />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <GraficaMediosPago />
            <GraficaMasVendidos />
          </div>
        </div>
        <aside className="order-1 grid grid-cols-1 content-start gap-3 sm:grid-cols-2 xl:order-2 xl:grid-cols-1">
          <Kpi icono="bi-receipt" titulo="Ventas de hoy" valor={PESOS.format(indicadores.ventasHoy)} detalle={indicadores.facturasHoy + ' facturas'} />
          <Kpi icono="bi-cart-check" titulo="Ticket promedio" valor={PESOS.format(indicadores.ticketPromedio)} color="acento" />
          <Kpi icono="bi-wallet2" titulo="Cartera por cobrar" valor={PESOS.format(indicadores.porCobrar)} color="exito" />
          <Kpi icono="bi-exclamation-octagon" titulo="Cartera vencida" valor={PESOS.format(indicadores.vencida)} color="peligro" />
          <Kpi icono="bi-cash-stack" titulo="Dinero en cajas" valor={PESOS.format(indicadores.enCajas)} />
          <Kpi icono="bi-box-seam" titulo="Productos por agotarse" valor={indicadores.porAgotarse} detalle="Por debajo del mínimo" color="aviso" />
        </aside>
      </div>
    </div>
  )
}
