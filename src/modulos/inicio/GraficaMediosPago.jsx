import { Doughnut } from 'react-chartjs-2'
import { opcionesBase } from '../../components/graficas/registro'
import Tarjeta from '../../components/graficas/Tarjeta'
import { coloresTema } from '../../config/tema'
import { useTema } from '../../config/temaContexto'
import { mediosDePago } from './datosEjemplo'

export default function GraficaMediosPago() {
  const { modo } = useTema()
  const colores = coloresTema(modo)
  const opciones = opcionesBase(colores)
  delete opciones.scales
  opciones.cutout = '62%'
  opciones.plugins.legend.position = 'bottom'
  opciones.plugins.tooltip.callbacks = { label: (item) => item.label + ': ' + item.raw + '%' }

  const datos = {
    labels: mediosDePago.nombres,
    datasets: [
      {
        data: mediosDePago.valores,
        backgroundColor: [colores.marca, colores.acento, colores.exito, colores.aviso],
        borderColor: colores.superficie,
        borderWidth: 3,
      },
    ],
  }

  return (
    <Tarjeta titulo="¿Cómo le pagan?" descripcion="Este mes">
      <Doughnut key={modo} data={datos} options={opciones} />
    </Tarjeta>
  )
}
