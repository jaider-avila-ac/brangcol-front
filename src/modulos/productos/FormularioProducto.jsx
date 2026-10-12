import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { productosApi } from './api'
import FormularioProductoCampos from './FormularioProductoCampos'
import { useCategorias, useImpuestos, useMarcas, useUnidades } from './useCatalogosProducto'

// Espera los catalogos antes de dibujar el formulario para que las listas muestren el valor guardado
export default function FormularioProducto() {
  const { codigo } = useParams()
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
  return <FormularioProductoCampos key={codigo || 'nuevo'} producto={codigo ? producto.data : null} impuestos={impuestos.data} />
}
