import { menu } from '../../config/menu'
import { tienePermiso, useSesion } from '../../modulos/auth/useSesion'
import GrupoContraido from './GrupoContraido'
import GrupoMenu from './GrupoMenu'

function gruposVisibles(sesion) {
  const grupos = []
  for (const grupo of menu) {
    const items = grupo.items.filter((item) => tienePermiso(sesion, item.permiso))
    if (items.length > 0) {
      grupos.push({ ...grupo, items })
    }
  }
  return grupos
}

export default function MenuLateral({ contraido, abiertoMovil, onCerrarMovil }) {
  const { data: sesion } = useSesion()
  const grupos = gruposVisibles(sesion)
  const ancho = contraido ? 'md:w-16' : 'md:w-64'
  const posicion = abiertoMovil ? 'translate-x-0' : '-translate-x-full'

  return (
    <>
      {abiertoMovil && <button type="button" aria-label="Cerrar menú" className="fixed inset-0 z-30 md:hidden" onClick={onCerrarMovil} />}
      <aside
        className={
          'fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-lateral text-sobre-lateral shadow-xl transition-all duration-200 ' +
          'md:static md:translate-x-0 md:shadow-none ' +
          ancho +
          ' ' +
          posicion
        }
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-lateral-linea px-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-acento text-lg font-black text-sobre-acento">B</span>
          <span className={'text-lg font-bold tracking-wide ' + (contraido ? 'md:hidden' : '')}>BrangCol</span>
          <button type="button" onClick={onCerrarMovil} className="ml-auto p-1 hover:bg-lateral-hover md:hidden" aria-label="Cerrar menú">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className={'barra-lateral flex-1 py-2 ' + (contraido ? 'md:overflow-visible' : 'overflow-y-auto')}>
          {grupos.map((grupo) =>
            contraido ? (
              <div key={grupo.grupo}>
                <div className="hidden md:block">
                  <GrupoContraido grupo={grupo} />
                </div>
                <div className="md:hidden">
                  <GrupoMenu grupo={grupo} onNavegar={onCerrarMovil} />
                </div>
              </div>
            ) : (
              <GrupoMenu key={grupo.grupo} grupo={grupo} onNavegar={onCerrarMovil} />
            ),
          )}
        </nav>
      </aside>
    </>
  )
}
