import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

Chart.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip)

export function opcionesBase(colores) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { labels: { color: colores.suave, boxWidth: 12, font: { size: 12 } } },
      tooltip: { cornerRadius: 0 },
    },
    scales: {
      x: { ticks: { color: colores.suave }, grid: { color: colores.borde }, border: { color: colores.borde } },
      y: { ticks: { color: colores.suave }, grid: { color: colores.borde }, border: { color: colores.borde } },
    },
  }
}

export const PESOS = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
