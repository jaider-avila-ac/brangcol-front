import { api } from '../../api/cliente'

function consulta(parametros) {
  const limpios = new URLSearchParams()
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== null && valor !== '') {
      limpios.append(clave, valor)
    }
  }
  return limpios.toString()
}

export const inventarioApi = {
  bodegas: () => api.get('/inventario/bodegas'),
  crearBodega: (datos) => api.post('/inventario/bodegas', datos),
  actualizarBodega: (codigo, datos) => api.put('/inventario/bodegas/' + codigo, datos),
  existencias: (filtro) => api.get('/inventario/existencias?' + consulta(filtro)),
  resumen: () => api.get('/inventario/existencias/resumen'),
  definirMinimo: (datos) => api.put('/inventario/existencias/minimo', datos),
  kardex: (item, filtro) => api.get('/inventario/kardex/' + item + '?' + consulta(filtro)),
  ajustes: (pagina) => api.get('/inventario/ajustes?pagina=' + pagina),
  ajuste: (codigo) => api.get('/inventario/ajustes/' + codigo),
  registrarAjuste: (datos) => api.post('/inventario/ajustes', datos),
  anularAjuste: (codigo, motivo) => api.post('/inventario/ajustes/' + codigo + '/anular', { motivo }),
  traslados: (pagina) => api.get('/inventario/traslados?pagina=' + pagina),
  traslado: (codigo) => api.get('/inventario/traslados/' + codigo),
  registrarTraslado: (datos) => api.post('/inventario/traslados', datos),
  recibirTraslado: (codigo, lineas) => api.post('/inventario/traslados/' + codigo + '/recibir', { lineas }),
  anularTraslado: (codigo, motivo) => api.post('/inventario/traslados/' + codigo + '/anular', { motivo }),
  registrarConteo: (datos) => api.post('/inventario/conteos', datos),
}
