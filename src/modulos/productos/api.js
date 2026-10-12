import { api } from '../../api/cliente'
import { formularioImagen } from '../../api/imagenes'

export const productosApi = {
  buscar: (filtro) => {
    const parametros = new URLSearchParams({
      texto: filtro.texto || '',
      tipo: filtro.tipo || '',
      categoria: filtro.categoria || '',
      soloComponentes: Boolean(filtro.soloComponentes),
      incluirInactivos: Boolean(filtro.incluirInactivos),
      pagina: filtro.pagina || 0,
      tamano: filtro.tamano || 20,
    })
    return api.get('/productos?' + parametros.toString())
  },
  obtener: (codigo) => api.get('/productos/' + codigo),
  crear: (datos) => api.post('/productos', datos),
  actualizar: (codigo, datos) => api.put('/productos/' + codigo, datos),
  cambiarEstado: (codigo, activo) => api.put('/productos/' + codigo + '/estado', { activo }),
  receta: (codigo) => api.get('/productos/' + codigo + '/receta'),
  guardarReceta: (codigo, componentes) => api.put('/productos/' + codigo + '/receta', { componentes }),
  subirFoto: (codigo, archivo) => api.subir('/productos/' + codigo + '/foto', formularioImagen(archivo)),
  categorias: () => api.get('/productos/categorias'),
  crearCategoria: (datos) => api.post('/productos/categorias', datos),
  actualizarCategoria: (codigo, datos) => api.put('/productos/categorias/' + codigo, datos),
  marcas: () => api.get('/productos/marcas'),
  crearMarca: (datos) => api.post('/productos/marcas', datos),
  actualizarMarca: (codigo, datos) => api.put('/productos/marcas/' + codigo, datos),
  unidades: () => api.get('/parametros/unidades'),
  impuestos: () => api.get('/impuestos'),
}

