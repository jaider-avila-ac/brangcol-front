import { api } from '../../api/cliente'

export const usuariosApi = {
  listar: () => api.get('/usuarios'),
  cambiarRol: (codigo, rol) => api.put('/usuarios/' + codigo + '/rol', { rol }),
  cambiarEstado: (codigo, activo) => api.put('/usuarios/' + codigo + '/estado', { activo }),
  roles: () => api.get('/roles'),
  invitaciones: () => api.get('/usuarios/invitaciones'),
  invitar: (datos) => api.post('/usuarios/invitaciones', datos),
  revocar: (codigo) => api.delete('/usuarios/invitaciones/' + codigo),
  consultarInvitacion: (token) => api.post('/invitaciones/consultar', { token }),
  aceptarInvitacion: (datos) => api.post('/invitaciones/aceptar', datos),
}
