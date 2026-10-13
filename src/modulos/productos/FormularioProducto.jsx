import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { productosApi } from './api'
import FichaProducto from './FichaProducto'
import FormularioProductoCampos from './FormularioProductoCampos'
import { TIPOS } from './tipos'
import { useCategorias, useImpuestos, useMarcas, useUnidades } from './useCatalogosProducto'

// Espera los catalogos antes de dibujar el formulario para que las listas muestren el valor guardado.
// Un producto nuevo abre solo el formulario; uno existente abre su ficha completa.
export default function FormularioProducto() {
  const { codigo } = useParams()
  const [parametros] = useSearchParams()
  const tipoInicial = TIPOS.some((t) => t.valor === parametros.get('tipo')) ? parametros.get('tipo') : null
  const impuestos = useImpuestos()
  const unidades = useUnidades()
  const categorias = useCategorias()
  const marcas = useMarcas()
  const producto = useQuery({
    queryKey: ['producto', codigo],
    queryFn: () => productosApi.obtener(codigo),
    enabled: Boolean(codigo),
  })

  if (impuestos.isPending || unidades.isPending || categorias.isPending || marcas.isPending || (codigo && producto.isPending)) {
    return <Cargando />
  }
  if (producto.isError) {
    return <Alerta>{producto.error.message}</Alerta>
  }
  if (codigo) {
    return <FichaProducto key={codigo} producto={producto.data} impuestos={impuestos.data} />
  }
  return <FormularioProductoCampos key="nuevo" producto={null} impuestos={impuestos.data} tipoInicial={tipoInicial} />
}
