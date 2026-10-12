import { Bar } from 'react-chartjs-2'
import { opcionesBase, PESOS } from '../../components/graficas/registro'
import Tarjeta from '../../components/graficas/Tarjeta'
import { coloresTema } from '../../config/tema'
import { useTema } from '../../config/temaContexto'
import { ventasPorDia } from './datosEjemplo'

export default function GraficaVentas() {
  const { modo } = useTema()
  const colores = coloresTema(modo)
  const opciones = opcionesBase(colores)
  opciones.scales.y.ticks.callback = (valor) => PESOS.format(valor)
  opciones.plugins.legend.display = false
  opciones.plugins.tooltip.callbacks = { label: (item) => PESOS.format(item.raw) }

  const datos = {
    labels: ventasPorDia.dias,
    datasets: [
      { label: 'Vendido', data: ventasPorDia.ventas, backgroundColor: colores.marca, barPercentage: 0.7 },
    ],
  }

  return (
    <Tarjeta titulo="Ventas de los últimos 14 días" alto="h-96">
      <Bar key={modo} data={datos} options={opciones} />
    </Tarjeta>
  )
}
