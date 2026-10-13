import { Link, useSearchParams } from 'react-router'
import Pestanas from '../../components/ui/Pestanas'
import Titulo from '../../components/ui/Titulo'
import Ajustes from './Ajustes'
import Bodegas from './Bodegas'
import Producciones from './Producciones'
import TomaFisica from './TomaFisica'
import Traslados from './Traslados'

const PESTANAS = [
  { id: 'movimientos', texto: 'Entradas y salidas', icono: 'bi-arrow-left-right' },
  { id: 'traslados', texto: 'Traslados', icono: 'bi-truck' },
  { id: 'produccion', texto: 'Producción', icono: 'bi-gear-wide-connected' },
  { id: 'conteo', texto: 'Conteo', icono: 'bi-clipboard-check' },
  { id: 'bodegas', texto: 'Bodegas', icono: 'bi-house' },
]

// Lo que se hace con el inventario. Cuanto hay de cada producto se ve en Productos y servicios.
// La pestana activa va en la direccion para volver al mismo lugar desde un formulario.
export default function InventarioPagina() {
  const [parametros, setParametros] = useSearchParams()
  const pedida = parametros.get('ver')
  const activa = PESTANAS.some((p) => p.id === pedida) ? pedida : 'movimientos'

  return (
    <>
      <Titulo>
        Registre lo que entra, sale, se traslada o se produce. Cuánto hay de cada producto se ve en{' '}
        <Link to="/productos" className="text-marca hover:underline">
          Productos y servicios
        </Link>
        .
      </Titulo>
      <Pestanas pestanas={PESTANAS} activa={activa} onCambiar={(id) => setParametros({ ver: id }, { replace: true })} />
      {activa === 'movimientos' && <Ajustes />}
      {activa === 'traslados' && <Traslados />}
      {activa === 'produccion' && <Producciones />}
      {activa === 'conteo' && <TomaFisica />}
      {activa === 'bodegas' && <Bodegas />}
    </>
  )
}
