import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import ListaNombres from '../../components/ui/ListaNombres'
import { tienePermiso, useSesion } from '../auth/useSesion'
import { inventarioApi } from './api'
import { useBodegas } from './useBodegas'

export default function Bodegas() {
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const bodegas = useBodegas()
  const editable = tienePermiso(sesion, 'plataforma:empresa:editar')
  const crear = useMutation({ mutationFn: (nombre) => inventarioApi.crearBodega({ nombre }), onSuccess: (datos) => consultas.setQueryData(['bodegas'], datos) })
  const editar = useMutation({ mutationFn: ({ codigo, datos }) => inventarioApi.actualizarBodega(codigo, datos), onSuccess: (datos) => consultas.setQueryData(['bodegas'], datos) })

  if (bodegas.isPending) {
    return <Cargando />
  }
  if (bodegas.isError) {
    return <Alerta>{bodegas.error.message}</Alerta>
  }
  return (
    <div className="max-w-2xl">
      <ListaNombres
        titulo="Bodegas"
        items={bodegas.data}
        editable={editable}
        error={crear.error || editar.error}
        guardando={crear.isPending}
        onCrear={(nombre) => crear.mutate(nombre)}
        onActualizar={(codigo, datos) => editar.mutate({ codigo, datos })}
        detalle={(b) => b.sede + (b.predeterminada ? ' · principal' : '')}
      />
    </div>
  )
}
