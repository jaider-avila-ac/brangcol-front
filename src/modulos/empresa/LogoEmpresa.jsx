import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import SubirImagen from '../../components/ui/SubirImagen'
import { CLAVE_SESION, useSesion } from '../auth/useSesion'
import { imagenesApi } from '../../api/imagenes'

export default function LogoEmpresa({ puedeEditar }) {
  const { data: sesion } = useSesion()
  const consultas = useQueryClient()
  const subir = useMutation({
    mutationFn: imagenesApi.subirLogo,
    onSuccess: () => consultas.invalidateQueries({ queryKey: CLAVE_SESION }),
  })

  return (
    <section className="flex flex-col gap-2 border border-borde bg-superficie p-4">
      <p className="font-semibold">Logo</p>
      {subir.isError && <Alerta>{subir.error.message}</Alerta>}
      <SubirImagen
        codigo={sesion.logo}
        etiqueta="Cambiar logo"
        ayuda="Aparece en el menú y en sus documentos. PNG, JPG o WEBP, máximo 3 MB"
        cargando={subir.isPending}
        disabled={!puedeEditar}
        icono="bi-building"
        onElegir={(archivo) => subir.mutate(archivo)}
      />
    </section>
  )
}
