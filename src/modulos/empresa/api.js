import { api } from '../../api/cliente'

export const empresaApi = {
  obtener: () => api.get('/empresa'),
  actualizar: (datos) => api.put('/empresa', datos),
  configuracion: () => api.get('/empresa/configuracion'),
  actualizarConfiguracion: (datos) => api.put('/empresa/configuracion', datos),
  sedes: () => api.get('/empresa/sedes'),
  crearSede: (datos) => api.post('/empresa/sedes', datos),
  actualizarSede: (codigo, datos) => api.put('/empresa/sedes/' + codigo, datos),
  municipios: (buscar) => api.get('/parametros/municipios?buscar=' + encodeURIComponent(buscar)),
}
