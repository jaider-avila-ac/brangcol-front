import { useState } from 'react'
import Pestanas from '../../components/ui/Pestanas'
import Titulo from '../../components/ui/Titulo'
import { tienePermiso, useSesion } from '../auth/useSesion'
import ConfiguracionEmpresa from './ConfiguracionEmpresa'
import DatosEmpresa from './DatosEmpresa'
import Sedes from './Sedes'

const PESTANAS = [
  { id: 'datos', texto: 'Datos', icono: 'bi-building' },
  { id: 'sedes', texto: 'Sedes', icono: 'bi-geo-alt' },
  { id: 'configuracion', texto: 'Configuración', icono: 'bi-sliders' },
]

export default function EmpresaPagina() {
  const [activa, setActiva] = useState('datos')
  const { data: sesion } = useSesion()
  const puedeEditar = tienePermiso(sesion, 'plataforma:empresa:editar')

  return (
    <>
      <Titulo descripcion="Datos de la empresa, sedes y configuración general">Empresa</Titulo>
      <Pestanas pestanas={PESTANAS} activa={activa} onCambiar={setActiva} />
      {activa === 'datos' && <DatosEmpresa puedeEditar={puedeEditar} />}
      {activa === 'sedes' && <Sedes puedeEditar={puedeEditar} />}
      {activa === 'configuracion' && <ConfiguracionEmpresa puedeEditar={puedeEditar} />}
    </>
  )
}
