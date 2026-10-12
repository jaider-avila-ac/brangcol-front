import { Link } from 'react-router'
import { tienePermiso, useSesion } from '../auth/useSesion'
import Kpi from './Kpi'

const ACCESOS = [
  { ruta: '/venta-rapida', texto: 'Nueva venta', icono: 'bi-lightning-charge', permiso: 'ventas:pos:vender' },
  { ruta: '/terceros', texto: 'Clientes', icono: 'bi-people', permiso: 'terceros:tercero:consultar' },
  { ruta: '/productos', texto: 'Productos', icono: 'bi-box-seam', permiso: 'productos:item:consultar' },
  { ruta: '/cartera', texto: 'Cartera', icono: 'bi-wallet2', permiso: 'cartera:estado_cuenta:consultar' },
]

export default function Inicio() {
  const { data: sesion } = useSesion()
  const accesos = ACCESOS.filter((acceso) => tienePermiso(sesion, acceso.permiso))

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="order-2 border border-borde bg-superficie p-6 xl:order-1">
        <h2 className="text-xl font-semibold text-texto">Hola, {sesion.persona.nombres}</h2>
        <p className="mt-1 text-sm text-suave">¿Qué quiere hacer hoy?</p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {accesos.map((acceso) => (
            <Link
              key={acceso.ruta}
              to={acceso.ruta}
              className="flex flex-col items-center gap-2 border border-borde px-3 py-5 text-sm text-texto hover:border-marca hover:text-marca"
            >
              <i className={'bi text-2xl text-marca ' + acceso.icono} />
              {acceso.texto}
            </Link>
          ))}
        </div>
      </section>

      <aside className="order-1 grid grid-cols-1 content-start gap-3 sm:grid-cols-2 xl:order-2 xl:grid-cols-1">
        <Kpi icono="bi-receipt" titulo="Vendido hoy" valor="—" detalle="Aún no hay ventas" />
        <Kpi icono="bi-wallet2" titulo="Le deben" valor="—" />
        <Kpi icono="bi-cash-stack" titulo="Dinero en caja" valor="—" />
        <Kpi icono="bi-box-seam" titulo="Productos por agotarse" valor="—" />
      </aside>
    </div>
  )
}
