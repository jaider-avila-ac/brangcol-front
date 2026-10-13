import { Link, useSearchParams } from 'react-router'
import Pestanas from '../../components/ui/Pestanas'
import { tienePermiso, useSesion } from '../auth/useSesion'
import MovimientosProducto from '../inventario/MovimientosProducto'
import EditorReceta from './EditorReceta'
import FormularioProductoCampos from './FormularioProductoCampos'
import { tituloReceta } from './receta'
import { CON_RECETA, nombreTipo } from './tipos'

// Todo lo de un producto en un solo lugar: sus datos, lo que lleva y sus movimientos de inventario
export default function FichaProducto({ producto, impuestos }) {
  const { data: sesion } = useSesion()
  const [parametros, setParametros] = useSearchParams()
  const pestanas = [{ id: 'datos', texto: 'Datos', icono: 'bi-pencil' }]
  if (CON_RECETA.includes(producto.tipo)) {
    pestanas.push({ id: 'receta', texto: tituloReceta(producto.tipo), icono: 'bi-diagram-3' })
  }
  if (producto.manejaInventario && tienePermiso(sesion, 'inventario:existencia:consultar')) {
    pestanas.push({ id: 'movimientos', texto: 'Movimientos', icono: 'bi-arrow-left-right' })
  }
  const pedida = parametros.get('ver')
  const activa = pestanas.some((p) => p.id === pedida) ? pedida : 'datos'

  return (
    <div className="flex max-w-5xl flex-col gap-3">
      <Link to="/productos" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver
      </Link>
      <p className="text-lg font-semibold">
        {producto.nombre}
        <span className="ml-2 text-sm font-normal text-suave">
          {nombreTipo(producto.tipo)} · {producto.sku}
          {!producto.activo && ' · inactivo'}
        </span>
      </p>
      {pestanas.length > 1 && <Pestanas pestanas={pestanas} activa={activa} onCambiar={(id) => setParametros({ ver: id }, { replace: true })} />}
      {activa === 'datos' && <FormularioProductoCampos producto={producto} impuestos={impuestos} />}
      {activa === 'receta' && <EditorReceta producto={producto} editable={tienePermiso(sesion, 'productos:receta:gestionar')} />}
      {activa === 'movimientos' && <MovimientosProducto item={producto.codigo} />}
    </div>
  )
}
