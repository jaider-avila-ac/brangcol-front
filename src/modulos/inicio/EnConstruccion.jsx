import Titulo from '../../components/ui/Titulo'

export default function EnConstruccion() {
  return (
    <>
      <Titulo>Módulo en construcción</Titulo>
      <div className="flex items-center gap-3 border border-borde bg-superficie p-4 text-suave">
        <i className="bi bi-tools text-xl" />
        <span>Este módulo se habilita en una próxima fase.</span>
      </div>
    </>
  )
}
