import Campo from '../../components/ui/Campo'
import Selector from '../../components/ui/Selector'

const CONTROLES = [
  { valor: 'NINGUNO', texto: 'No controlar' },
  { valor: 'ADVERTIR', texto: 'Avisar al vender' },
  { valor: 'BLOQUEAR', texto: 'No dejar vender a crédito' },
]

export default function CondicionesCliente({ register, editable }) {
  return (
    <div className="border-t border-borde pt-4">
      <p className="mb-3 text-sm font-semibold">Crédito como cliente</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Campo id="cliente-plazo" etiqueta="Plazo para pagar (días)" type="number" min="0" max="365" disabled={!editable} registro={register('cliente.plazoDias')} />
        <Campo id="cliente-cupo" etiqueta="Cupo de crédito" type="number" min="0" placeholder="Sin límite" disabled={!editable} registro={register('cliente.cupoCredito')} />
        <Selector id="cliente-control" etiqueta="Si pasa el cupo o tiene facturas vencidas" opciones={CONTROLES} disabled={!editable} registro={register('cliente.controlCredito')} />
      </div>
    </div>
  )
}
