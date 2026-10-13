import { useSearchParams } from 'react-router'
import Pestanas from '../../components/ui/Pestanas'
import Titulo from '../../components/ui/Titulo'
import Ajustes from './Ajustes'
import Bodegas from './Bodegas'
import Existencias from './Existencias'
import Producciones from './Producciones'
import Traslados from './Traslados'

const PESTANAS = [
  { id: 'existencias', texto: 'Existencias', icono: 'bi-boxes' },
  { id: 'movimientos', texto: 'Entradas y salidas', icono: 'bi-arrow-left-right' },
  { id: 'traslados', texto: 'Traslados', icono: 'bi-truck' },
  { id: 'produccion', texto: 'Producción', icono: 'bi-gear-wide-connected' },
  { id: 'bodegas', texto: 'Bodegas', icono: 'bi-house' },
]

// La pestana activa va en la direccion para volver al mismo lugar desde un formulario
export default function InventarioPagina() {
  const [parametros, setParametros] = useSearchParams()
  const activa = parametros.get('ver') || 'existencias'

  return (
    <>
      <Titulo>Cuánto tiene de cada producto, en qué bodega y cómo se ha movido</Titulo>
      <Pestanas pestanas={PESTANAS} activa={activa} onCambiar={(id) => setParametros({ ver: id }, { replace: true })} />
      {activa === 'existencias' && <Existencias />}
      {activa === 'movimientos' && <Ajustes />}
      {activa === 'traslados' && <Traslados />}
      {activa === 'produccion' && <Producciones />}
      {activa === 'bodegas' && <Bodegas />}
    </>
  )
}
