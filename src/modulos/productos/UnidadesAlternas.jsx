import { useFieldArray } from 'react-hook-form'
import { useUnidades } from './useCatalogosProducto'

export default function UnidadesAlternas({ control, register, unidadBase, editable }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'unidades' })
  const unidades = useUnidades()
  const lista = unidades.data || []
  const base = lista.find((u) => u.codigo === unidadBase)
  const clase = 'border border-borde bg-superficie px-2 py-1.5 text-sm outline-none focus:border-marca'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Otras presentaciones</p>
          <p className="text-xs text-suave">Ej. se compra por resma de 500 hojas y se vende por hoja</p>
        </div>
        {editable && (
          <button
            type="button"
            onClick={() => append({ unidad: '', factor: '', precioVenta: '', paraCompra: true, paraVenta: true })}
            className="flex items-center gap-1 border border-borde px-2 py-1 text-sm hover:bg-superficie-alt"
          >
            <i className="bi bi-plus" /> Agregar
          </button>
        )}
      </div>
      {fields.map((campo, indice) => (
        <div key={campo.id} className="flex flex-wrap items-center gap-2 text-sm">
          <span>1</span>
          <select disabled={!editable} {...register('unidades.' + indice + '.unidad', { required: true })} className={clase}>
            <option value="">Unidad</option>
            {lista
              .filter((u) => u.codigo !== unidadBase)
              .map((u) => (
                <option key={u.codigo} value={u.codigo}>
                  {u.nombre}
                </option>
              ))}
          </select>
          <span>=</span>
          <input type="number" step="any" min="0" disabled={!editable} {...register('unidades.' + indice + '.factor', { required: true })} className={clase + ' w-24'} />
          <span>{base ? base.nombre.toLowerCase() : ''}</span>
          <input type="number" min="0" placeholder="Precio (opcional)" disabled={!editable} {...register('unidades.' + indice + '.precioVenta')} className={clase + ' w-40'} />
          <label className="flex items-center gap-1">
            <input type="checkbox" disabled={!editable} {...register('unidades.' + indice + '.paraCompra')} className="accent-marca" /> Compra
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" disabled={!editable} {...register('unidades.' + indice + '.paraVenta')} className="accent-marca" /> Venta
          </label>
          {editable && (
            <button type="button" onClick={() => remove(indice)} className="px-2 text-suave hover:text-texto" aria-label="Quitar">
              <i className="bi bi-trash" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
