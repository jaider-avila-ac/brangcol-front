import { useState } from 'react'
import Pestanas from '../../components/ui/Pestanas'
import Titulo from '../../components/ui/Titulo'
import { tienePermiso, useSesion } from '../auth/useSesion'
import Invitaciones from './Invitaciones'
import ListaUsuarios from './ListaUsuarios'
import Roles from './Roles'

const PESTANAS = [
  { id: 'usuarios', texto: 'Usuarios', icono: 'bi-person' },
  { id: 'invitaciones', texto: 'Invitaciones', icono: 'bi-envelope' },
  { id: 'roles', texto: 'Roles y permisos', icono: 'bi-shield-check' },
]

export default function UsuariosPagina() {
  const [activa, setActiva] = useState('usuarios')
  const { data: sesion } = useSesion()
  const puedeGestionar = tienePermiso(sesion, 'plataforma:usuario:gestionar')

  return (
    <>
      <Titulo descripcion="Quién usa el sistema y qué puede hacer cada uno">Usuarios</Titulo>
      <Pestanas pestanas={PESTANAS} activa={activa} onCambiar={setActiva} />
      {activa === 'usuarios' && <ListaUsuarios puedeGestionar={puedeGestionar} />}
      {activa === 'invitaciones' && <Invitaciones puedeGestionar={puedeGestionar} />}
      {activa === 'roles' && <Roles />}
    </>
  )
}
