import Titulo from '../../components/ui/Titulo'
import CambiarContrasena from './CambiarContrasena'
import MisSesiones from './MisSesiones'
import { useSesion } from './useSesion'

export default function MiCuenta() {
  const { data: sesion } = useSesion()

  return (
    <>
      <Titulo descripcion="Sus datos, su contraseña y los dispositivos donde tiene sesión abierta">Mi cuenta</Titulo>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="border border-borde bg-white p-4">
          <h2 className="mb-3 font-semibold text-marca">Datos</h2>
          <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
            <dt className="text-suave">Nombre</dt>
            <dd>{[sesion.persona.nombres, sesion.persona.apellidos].filter(Boolean).join(' ')}</dd>
            <dt className="text-suave">Correo</dt>
            <dd className="break-all">{sesion.persona.correo}</dd>
            <dt className="text-suave">Empresa</dt>
            <dd>{sesion.empresa.razonSocial}</dd>
            <dt className="text-suave">Rol</dt>
            <dd>{sesion.rol.nombre}</dd>
          </dl>
        </section>
        <CambiarContrasena />
        <div className="xl:col-span-2">
          <MisSesiones />
        </div>
      </div>
    </>
  )
}
