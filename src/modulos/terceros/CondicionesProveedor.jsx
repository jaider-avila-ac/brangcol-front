import Campo from '../../components/ui/Campo'
import Selector from '../../components/ui/Selector'
import { useBancos } from './useCatalogos'

const TIPOS_CUENTA = [
  { valor: 'AHORROS', texto: 'Ahorros' },
  { valor: 'CORRIENTE', texto: 'Corriente' },
  { valor: 'BILLETERA', texto: 'Billetera digital' },
]

export default function CondicionesProveedor({ register, editable }) {
  const bancos = useBancos()
  const opcionesBanco = (bancos.data || []).map((banco) => ({ valor: banco, texto: banco }))

  return (
    <div className="border-t border-borde pt-4">
      <p className="mb-3 text-sm font-semibold">Como proveedor</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Campo id="proveedor-plazo" etiqueta="Plazo que nos da (días)" type="number" min="0" max="365" disabled={!editable} registro={register('proveedor.plazoDias')} />
        <Selector id="proveedor-banco" etiqueta="Banco" vacio="Sin cuenta" opciones={opcionesBanco} disabled={!editable} registro={register('proveedor.banco')} />
        <Selector id="proveedor-tipo" etiqueta="Tipo de cuenta" vacio="—" opciones={TIPOS_CUENTA} disabled={!editable} registro={register('proveedor.tipoCuenta')} />
        <Campo id="proveedor-cuenta" etiqueta="Número de cuenta" disabled={!editable} registro={register('proveedor.numeroCuenta')} />
      </div>
    </div>
  )
}
