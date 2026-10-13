import { useQuery } from '@tanstack/react-query'
import { pesos } from '../../config/formato'
import { inventarioApi } from '../inventario/api'

export default function ResumenInventario({ onPorAcabarse }) {
  const resumen = useQuery({ queryKey: ['existencias', 'resumen'], queryFn: inventarioApi.resumen })

  if (!resumen.data) {
    return null
  }
  return (
    <p className="mb-4 text-sm text-suave">
      Valor del inventario: <strong className="text-texto">{pesos(resumen.data.valorTotal)}</strong>
      {resumen.data.bajoMinimo > 0 && (
        <>
          {' · '}
          <button type="button" onClick={onPorAcabarse} className="text-marca hover:underline">
            {resumen.data.bajoMinimo} por acabarse
          </button>
        </>
      )}
    </p>
  )
}
