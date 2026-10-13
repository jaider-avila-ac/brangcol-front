import { useState } from 'react'
import Alerta from '../../components/ui/Alerta'
import Boton from '../../components/ui/Boton'
import { cantidad } from '../../config/formato'

// Confirma lo que llego; por defecto todo lo enviado
export default function RecibirTraslado({ lineas, cargando, error, onRecibir }) {
  const [recibidas, setRecibidas] = useState(() => {
    const iniciales = {}
    for (const l of lineas) {
      iniciales[l.item] = String(Number(l.cantidad))
    }
    return iniciales
  })

  function enviar() {
    const resultado = []
    for (const l of lineas) {
      resultado.push({ item: l.item, cantidad: Number(recibidas[l.item] || 0) })
    }
    onRecibir(resultado)
  }

  return (
    <section className="flex flex-col gap-3 border border-borde bg-superficie p-4">
      <p className="font-semibold">¿Llegó todo?</p>
      <p className="text-sm text-suave">Si llegó menos de lo enviado, corrija la cantidad antes de confirmar.</p>
      {error && <Alerta>{error.message}</Alerta>}
      <table className="w-full text-sm">
        <thead className="text-left text-suave">
          <tr>
            <th className="py-2 pr-3 font-medium">Producto</th>
            <th className="py-2 pr-3 text-right font-medium">Enviado</th>
            <th className="py-2 font-medium">Llegó</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">
          {lineas.map((l) => (
            <tr key={l.item}>
              <td className="py-2 pr-3">{l.nombre}</td>
              <td className="py-2 pr-3 text-right whitespace-nowrap">
                {cantidad(l.cantidad)} {l.unidad}
              </td>
              <td className="py-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={recibidas[l.item]}
                  onChange={(e) => setRecibidas({ ...recibidas, [l.item]: e.target.value })}
                  className="w-28 border border-borde bg-superficie px-2 py-1.5 text-sm outline-none focus:border-marca"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Boton icono="bi-check-lg" cargando={cargando} onClick={enviar}>
          Confirmar llegada
        </Boton>
      </div>
    </section>
  )
}
