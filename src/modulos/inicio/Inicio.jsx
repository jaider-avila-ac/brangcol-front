import Titulo from '../../components/ui/Titulo'

export default function Inicio() {
  return (
    <>
      <Titulo descripcion="Resumen de la empresa">Inicio</Titulo>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador icono="bi-receipt" texto="Ventas de hoy" />
        <Indicador icono="bi-wallet2" texto="Cartera por cobrar" />
        <Indicador icono="bi-cash-stack" texto="Dinero en cajas" />
        <Indicador icono="bi-exclamation-triangle" texto="Productos por agotarse" />
      </div>
    </>
  )
}

function Indicador({ icono, texto }) {
  return (
    <div className="flex items-center gap-4 border border-borde bg-white p-4">
      <div className="flex h-11 w-11 items-center justify-center bg-marca-claro text-marca">
        <i className={'bi ' + icono + ' text-xl'} />
      </div>
      <div>
        <p className="text-sm text-suave">{texto}</p>
        <p className="text-lg font-semibold">-</p>
      </div>
    </div>
  )
}
