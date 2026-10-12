// Convierte entre el producto del servidor y los campos del formulario.
// El precio se guarda sin impuesto; en pantalla se puede escribir con el IVA incluido.

function redondear(valor) {
  return Math.round(valor * 100) / 100
}

export function tarifaDe(impuestos, codigo) {
  const impuesto = (impuestos || []).find((i) => i.codigo === codigo)
  return impuesto ? Number(impuesto.tarifa) : 0
}

export function valoresIniciales(producto, impuestos) {
  if (!producto) {
    return {
      tipo: 'SIMPLE',
      nombre: '',
      sku: '',
      descripcion: '',
      categoria: '',
      marca: '',
      unidad: '94',
      permiteFraccion: false,
      impuesto: impuestos && impuestos.length > 0 ? impuestos[0].codigo : '',
      precio: '',
      incluyeImpuesto: true,
      codigosBarras: [],
      unidades: [],
    }
  }
  const tarifa = Number(producto.tarifaImpuesto || 0)
  return {
    tipo: producto.tipo,
    nombre: producto.nombre,
    sku: producto.sku,
    descripcion: producto.descripcion || '',
    categoria: producto.categoria ? producto.categoria.codigo : '',
    marca: producto.marca ? producto.marca.codigo : '',
    unidad: producto.unidad,
    permiteFraccion: producto.permiteFraccion,
    impuesto: producto.impuesto || '',
    precio: redondear(Number(producto.precioVenta) * (1 + tarifa / 100)),
    incluyeImpuesto: true,
    codigosBarras: producto.codigosBarras,
    unidades: producto.unidades.map((u) => ({
      unidad: u.unidad,
      factor: u.factor,
      precioVenta: u.precioVenta ?? '',
      paraCompra: u.paraCompra,
      paraVenta: u.paraVenta,
    })),
  }
}

export function aPeticion(valores, impuestos) {
  const tarifa = tarifaDe(impuestos, valores.impuesto)
  const precio = Number(valores.precio || 0)
  return {
    tipo: valores.tipo,
    nombre: valores.nombre,
    sku: valores.sku,
    descripcion: valores.descripcion,
    categoria: valores.categoria,
    marca: valores.marca,
    unidad: valores.unidad,
    permiteFraccion: valores.permiteFraccion,
    impuesto: valores.impuesto,
    precioVenta: valores.incluyeImpuesto ? redondear(precio / (1 + tarifa / 100)) : precio,
    codigosBarras: valores.codigosBarras,
    unidades: valores.unidades.map((u) => ({
      unidad: u.unidad,
      factor: Number(u.factor),
      precioVenta: u.precioVenta === '' ? null : Number(u.precioVenta),
      paraCompra: u.paraCompra,
      paraVenta: u.paraVenta,
    })),
  }
}
