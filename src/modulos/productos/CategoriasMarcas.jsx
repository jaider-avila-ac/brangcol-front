import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import Cargando from '../../components/ui/Cargando'
import Titulo from '../../components/ui/Titulo'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { productosApi } from './api'
import ListaNombres from './ListaNombres'
import { useCategorias, useMarcas } from './useCatalogosProducto'

export default function CategoriasMarcas() {
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const categorias = useCategorias()
  const marcas = useMarcas()
  const editable = tienePermiso(sesion, 'productos:item:gestionar')

  const crearCategoria = useMutation({ mutationFn: (nombre) => productosApi.crearCategoria({ nombre }), onSuccess: (datos) => consultas.setQueryData(['categorias'], datos) })
  const editarCategoria = useMutation({ mutationFn: ({ codigo, datos }) => productosApi.actualizarCategoria(codigo, datos), onSuccess: (datos) => consultas.setQueryData(['categorias'], datos) })
  const crearMarca = useMutation({ mutationFn: (nombre) => productosApi.crearMarca({ nombre }), onSuccess: (datos) => consultas.setQueryData(['marcas'], datos) })
  const editarMarca = useMutation({ mutationFn: ({ codigo, datos }) => productosApi.actualizarMarca(codigo, datos), onSuccess: (datos) => consultas.setQueryData(['marcas'], datos) })

  if (categorias.isPending || marcas.isPending) {
    return <Cargando />
  }

  return (
    <div className="flex flex-col gap-4">
      <Titulo>Ordene sus productos por categoría y marca</Titulo>
      <Link to="/productos" className="text-sm text-marca hover:underline">
        <i className="bi bi-arrow-left" /> Volver a productos
      </Link>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListaNombres
          titulo="Categorías"
          items={categorias.data}
          editable={editable}
          error={crearCategoria.error || editarCategoria.error}
          guardando={crearCategoria.isPending}
          onCrear={(nombre) => crearCategoria.mutate(nombre)}
          onActualizar={(codigo, datos) => editarCategoria.mutate({ codigo, datos })}
          detalle={(c) => c.productos + ' productos'}
        />
        <ListaNombres
          titulo="Marcas"
          items={marcas.data}
          editable={editable}
          error={crearMarca.error || editarMarca.error}
          guardando={crearMarca.isPending}
          onCrear={(nombre) => crearMarca.mutate(nombre)}
          onActualizar={(codigo, datos) => editarMarca.mutate({ codigo, datos })}
        />
      </div>
    </div>
  )
}
