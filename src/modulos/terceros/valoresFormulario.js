// Convierte entre el tercero del servidor y los campos del formulario

export function valoresIniciales(tercero) {
  if (!tercero) {
    return {
      tipoPersona: 'NATURAL',
      tipoDocumento: '13',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      razonSocial: '',
      nombreComercial: '',
      responsableIva: false,
      direccion: '',
      municipio: '',
      telefono: '',
      correo: '',
      notas: '',
      esCliente: true,
      esProveedor: false,
      cliente: { plazoDias: 0, cupoCredito: '', controlCredito: 'NINGUNO' },
      proveedor: { plazoDias: 0, banco: '', tipoCuenta: '', numeroCuenta: '' },
    }
  }
  return {
    tipoPersona: tercero.tipoPersona,
    tipoDocumento: tercero.tipoDocumento || '13',
    numeroDocumento: tercero.numeroDocumento || '',
    nombres: tercero.nombres || '',
    apellidos: tercero.apellidos || '',
    razonSocial: tercero.razonSocial || '',
    nombreComercial: tercero.nombreComercial || '',
    responsableIva: tercero.responsableIva,
    direccion: tercero.direccion || '',
    municipio: tercero.municipio ? tercero.municipio.codigo : '',
    telefono: tercero.telefono || '',
    correo: tercero.correo || '',
    notas: tercero.notas || '',
    esCliente: Boolean(tercero.cliente),
    esProveedor: Boolean(tercero.proveedor),
    cliente: tercero.cliente
      ? { ...tercero.cliente, cupoCredito: tercero.cliente.cupoCredito ?? '' }
      : { plazoDias: 0, cupoCredito: '', controlCredito: 'NINGUNO' },
    proveedor: tercero.proveedor
      ? {
          plazoDias: tercero.proveedor.plazoDias,
          banco: tercero.proveedor.banco || '',
          tipoCuenta: tercero.proveedor.tipoCuenta || '',
          numeroCuenta: tercero.proveedor.numeroCuenta || '',
        }
      : { plazoDias: 0, banco: '', tipoCuenta: '', numeroCuenta: '' },
  }
}

export function aPeticion(valores, tercero) {
  const esCliente = valores.esCliente || Boolean(tercero && tercero.cliente)
  const esProveedor = valores.esProveedor || Boolean(tercero && tercero.proveedor)
  const conDocumento = valores.numeroDocumento.trim() !== ''
  return {
    tipoPersona: valores.tipoPersona,
    tipoDocumento: conDocumento ? valores.tipoDocumento : null,
    numeroDocumento: conDocumento ? valores.numeroDocumento : null,
    nombres: valores.nombres,
    apellidos: valores.apellidos,
    razonSocial: valores.razonSocial,
    nombreComercial: valores.nombreComercial,
    responsableIva: valores.responsableIva,
    direccion: valores.direccion,
    municipio: valores.municipio,
    telefono: valores.telefono,
    correo: valores.correo,
    notas: valores.notas,
    cliente: esCliente
      ? {
          plazoDias: Number(valores.cliente.plazoDias || 0),
          cupoCredito: valores.cliente.cupoCredito === '' ? null : Number(valores.cliente.cupoCredito),
          controlCredito: valores.cliente.controlCredito,
        }
      : null,
    proveedor: esProveedor
      ? {
          plazoDias: Number(valores.proveedor.plazoDias || 0),
          banco: valores.proveedor.banco,
          tipoCuenta: valores.proveedor.tipoCuenta,
          numeroCuenta: valores.proveedor.numeroCuenta,
        }
      : null,
  }
}
