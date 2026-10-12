import { useState } from 'react'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'

// Lista simple de nombres (categorias o marcas): agregar, renombrar y activar o desactivar
export default function ListaNombres({ titulo, items, editable, error, guardando, onCrear, onActualizar, detalle }) {
  const [nuevo, setNuevo] = useState('')
  const [editando, setEditando] = useState(null)
  const [texto, setTexto] = useState('')

  function crear(evento) {
    evento.preventDefault()
    if (nuevo.trim()) {
      onCrear(nuevo.trim())
      setNuevo('')
    }
  }

  return (
    <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
      <h2 className="font-semibold">{titulo}</h2>
      {error && <Alerta>{error.message}</Alerta>}
      {editable && (
        <form onSubmit={crear} className="flex gap-2">
          <input value={nuevo} onChange={(e) => setNuevo(e.target.value)} placeholder="Nombre" maxLength={80} className="flex-1 border border-borde bg-superficie px-3 py-2 text-sm outline-none focus:border-marca" />
          <Boton type="submit" icono="bi-plus-lg" cargando={guardando}>
            Agregar
          </Boton>
        </form>
      )}
      <ul className="divide-y divide-borde border border-borde">
        {items.length === 0 && <li className="px-3 py-3 text-sm text-suave">Todavía no hay registros</li>}
        {items.map((item) => (
          <li key={item.codigo} className={'flex items-center gap-2 px-3 py-2 text-sm ' + (item.activa ? '' : 'text-suave')}>
            {editando === item.codigo ? (
              <>
                <input value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={80} autoFocus className="flex-1 border border-borde bg-superficie px-2 py-1" />
                <button type="button" onClick={() => { onActualizar(item.codigo, { nombre: texto, activa: item.activa }); setEditando(null) }} className="text-marca">
                  Guardar
                </button>
                <button type="button" onClick={() => setEditando(null)} className="text-suave">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {item.nombre}
                  {detalle && <span className="ml-2 text-xs text-suave">{detalle(item)}</span>}
                  {!item.activa && <span className="ml-2 text-xs">(inactiva)</span>}
                </span>
                {editable && (
                  <>
                    <button type="button" onClick={() => { setEditando(item.codigo); setTexto(item.nombre) }} className="text-marca hover:underline">
                      Renombrar
                    </button>
                    <button type="button" onClick={() => onActualizar(item.codigo, { nombre: item.nombre, activa: !item.activa })} className="text-suave hover:text-texto">
                      {item.activa ? 'Desactivar' : 'Activar'}
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
