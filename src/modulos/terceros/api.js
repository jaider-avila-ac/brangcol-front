import { api } from '../../api/cliente'

export const tercerosApi = {
  buscar: (filtro) => {
    const parametros = new URLSearchParams({
      texto: filtro.texto,
      rol: filtro.rol,
      soloDeben: filtro.soloDeben,
      pagina: filtro.pagina,
      tamano: 20,
    })
    return api.get('/terceros?' + parametros.toString())
  },
  obtener: (codigo) => api.get('/terceros/' + codigo),
  porDocumento: (tipo, numero) =>
    api.get('/terceros/documento?tipo=' + encodeURIComponent(tipo) + '&numero=' + encodeURIComponent(numero)),
  crear: (datos) => api.post('/terceros', datos),
  actualizar: (codigo, datos) => api.put('/terceros/' + codigo, datos),
  cambiarEstado: (codigo, activo) => api.put('/terceros/' + codigo + '/estado', { activo }),
  importar: (archivo) => {
    const formulario = new FormData()
    formulario.append('archivo', archivo)
    return api.subir('/terceros/importar', formulario)
  },
  tiposDocumento: () => api.get('/parametros/tipos-documento'),
  bancos: () => api.get('/parametros/bancos'),
}
