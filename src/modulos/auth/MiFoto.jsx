import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import SubirImagen from '../../components/ui/SubirImagen'
import { imagenesApi } from '../../api/imagenes'
import { CLAVE_SESION, useSesion } from './useSesion'

export default function MiFoto() {
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const subir = useMutation({
    mutationFn: imagenesApi.subirMiFoto,
    onSuccess: () => consultas.invalidateQueries({ queryKey: CLAVE_SESION }),
  })

  return (
    <div className="flex flex-col gap-2">
      {subir.isError && <Alerta>{subir.error.message}</Alerta>}
      <SubirImagen codigo={sesion.foto} etiqueta="Cambiar foto" ayuda="PNG, JPG o WEBP, máximo 3 MB" cargando={subir.isPending} icono="bi-person" onElegir={(archivo) => subir.mutate(archivo)} />
    </div>
  )
}
