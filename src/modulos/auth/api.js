import { api } from '../../api/cliente'

export const authApi = {
  login: (datos) => api.post('/auth/login', datos),
  empresas: (datos) => api.post('/auth/empresas', datos),
  salir: () => api.post('/auth/salir'),
  yo: () => api.get('/auth/yo'),
  sesiones: () => api.get('/auth/sesiones'),
  cerrarSesion: (codigo) => api.delete('/auth/sesiones/' + codigo),
  cerrarOtrasSesiones: () => api.delete('/auth/sesiones'),
  cambiarContrasena: (datos) => api.put('/auth/contrasena', datos),
}
