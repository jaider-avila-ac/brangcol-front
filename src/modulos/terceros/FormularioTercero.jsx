import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Cargando from '../../components/ui/Cargando'
import { tercerosApi } from './api'
import FormularioTerceroCampos from './FormularioTerceroCampos'

export default function FormularioTercero() {
  const { codigo } = useParams()
  const tercero = useQuery({
    queryKey: ['tercero', codigo],
    queryFn: () => tercerosApi.obtener(codigo),
    enabled: Boolean(codigo),
  })

  if (!codigo) {
    return <FormularioTerceroCampos tercero={null} />
  }
  if (tercero.isPending) {
    return <Cargando />
  }
  if (tercero.isError) {
    return <Alerta>{tercero.error.message}</Alerta>
  }
  return <FormularioTerceroCampos key={codigo} tercero={tercero.data} />
}
