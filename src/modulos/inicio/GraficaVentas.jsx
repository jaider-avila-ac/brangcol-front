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
  opciones.plugins.tooltip.callbacks = { label: (item) => item.dataset.label + ': ' + PESOS.format(item.raw) }

  const datos = {
    labels: ventasPorDia.dias,
    datasets: [
      { label: 'Facturado', data: ventasPorDia.ventas, backgroundColor: colores.marca, barPercentage: 0.8 },
      { label: 'Cobrado', data: ventasPorDia.cobrado, backgroundColor: colores.acento, barPercentage: 0.8 },
    ],
  }

  return (
    <Tarjeta titulo="Ventas de los últimos 14 días" descripcion="Lo facturado frente a lo que ya entró a caja" alto="h-96">
      <Bar key={modo} data={datos} options={opciones} />
    </Tarjeta>
  )
}
