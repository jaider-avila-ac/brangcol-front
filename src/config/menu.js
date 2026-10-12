export const menu = [
  {
    grupo: 'Principal',
    icono: 'bi-grid-1x2',
    items: [{ ruta: '/', texto: 'Inicio', icono: 'bi-house' }],
  },
  {
    grupo: 'Ventas',
    icono: 'bi-receipt',
    items: [
      { ruta: '/venta-rapida', texto: 'Venta rápida', icono: 'bi-lightning-charge', permiso: 'ventas:pos:vender' },
      { ruta: '/ventas', texto: 'Facturas', icono: 'bi-receipt', permiso: 'ventas:factura:consultar' },
      { ruta: '/cartera', texto: 'Cartera', icono: 'bi-wallet2', permiso: 'cartera:estado_cuenta:consultar' },
    ],
  },
  {
    grupo: 'Contactos',
    icono: 'bi-people',
    items: [{ ruta: '/terceros', texto: 'Clientes y proveedores', icono: 'bi-people', permiso: 'terceros:tercero:consultar' }],
  },
  {
    grupo: 'Inventario',
    icono: 'bi-box-seam',
    items: [
      { ruta: '/productos', texto: 'Productos', icono: 'bi-box-seam', permiso: 'productos:item:consultar' },
      { ruta: '/inventario', texto: 'Existencias', icono: 'bi-boxes', permiso: 'inventario:existencia:consultar' },
      { ruta: '/compras', texto: 'Compras', icono: 'bi-cart3', permiso: 'compras:compra:consultar' },
    ],
  },
  {
    grupo: 'Dinero',
    icono: 'bi-cash-stack',
    items: [
      { ruta: '/cajas', texto: 'Cajas', icono: 'bi-cash-stack', permiso: 'ventas:turno:gestionar' },
      { ruta: '/movimientos', texto: 'Ingresos y gastos', icono: 'bi-arrow-left-right', permiso: 'tesoreria:movimiento:consultar' },
    ],
  },
  {
    grupo: 'Análisis',
    icono: 'bi-bar-chart',
    items: [{ ruta: '/reportes', texto: 'Reportes', icono: 'bi-bar-chart', permiso: 'reportes:general:consultar' }],
  },
  {
    grupo: 'Administración',
    icono: 'bi-gear',
    items: [
      { ruta: '/usuarios', texto: 'Usuarios', icono: 'bi-person-badge', permiso: 'plataforma:usuario:consultar' },
      { ruta: '/empresa', texto: 'Empresa', icono: 'bi-building', permiso: 'plataforma:empresa:consultar' },
    ],
  },
]

export function itemsDelMenu() {
  const items = []
  for (const grupo of menu) {
    for (const item of grupo.items) {
      items.push({ ...item, grupo: grupo.grupo })
    }
  }
  return items
}

export function ubicacion(ruta) {
  if (ruta === '/mi-cuenta') {
    return { grupo: 'Cuenta', texto: 'Mi cuenta' }
  }
  for (const item of itemsDelMenu()) {
    if (item.ruta === ruta || (item.ruta !== '/' && ruta.startsWith(item.ruta + '/'))) {
      return item
    }
  }
  return null
}
