import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import { inventarioApi } from './api'

// Cantidad minima en una bodega: por debajo, el producto aparece "por acabarse"
export default function Minimo({ bodega, item }) {
  const consultas = useQueryClient()
  const [minimo, setMinimo] = useState('')
  const guardar = useMutation({
    mutationFn: () => inventarioApi.definirMinimo({ bodega, item, minimo: minimo === '' ? null : Number(minimo) }),
    onSuccess: () => consultas.invalidateQueries({ queryKey: ['existencias'] }),
  })

  return (
    <div className="flex flex-col gap-2">
      {guardar.isError && <Alerta>{guardar.error.message}</Alerta>}
      {guardar.isSuccess && <Alerta tipo="exito">Mínimo guardado.</Alerta>}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span>Avisar cuando en esta bodega queden</span>
        <input type="number" min="0" step="any" value={minimo} onChange={(e) => setMinimo(e.target.value)} placeholder="Sin aviso" className="w-28 border border-borde bg-superficie px-2 py-1.5 outline-none focus:border-marca" />
        <span>o menos</span>
        <Boton variante="secundario" cargando={guardar.isPending} onClick={() => guardar.mutate()}>
          Guardar
        </Boton>
      </div>
    </div>
  )
}
