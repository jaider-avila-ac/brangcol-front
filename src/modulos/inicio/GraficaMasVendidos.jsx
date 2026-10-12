import { Bar } from 'react-chartjs-2'
import { opcionesBase } from '../../components/graficas/registro'
import Tarjeta from '../../components/graficas/Tarjeta'
import { coloresTema } from '../../config/tema'
import { useTema } from '../../config/temaContexto'
import { masVendidos } from './datosEjemplo'

export default function GraficaMasVendidos() {
  const { modo } = useTema()
  const colores = coloresTema(modo)
  const opciones = opcionesBase(colores)
  opciones.indexAxis = 'y'
  opciones.plugins.legend.display = false
  opciones.scales.y.grid.display = false

  const datos = {
    labels: masVendidos.productos,
    datasets: [{ label: 'Unidades', data: masVendidos.unidades, backgroundColor: colores.marca, barPercentage: 0.7 }],
  }

  return (
    <Tarjeta titulo="Productos más vendidos" descripcion="Unidades vendidas en el mes">
      <Bar key={modo} data={datos} options={opciones} />
    </Tarjeta>
  )
}
