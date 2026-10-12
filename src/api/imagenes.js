import { api } from './cliente'

export function formularioImagen(archivo) {
  const formulario = new FormData()
  formulario.append('imagen', archivo)
  return formulario
}

export const imagenesApi = {
  subirLogo: (archivo) => api.subir('/empresa/logo', formularioImagen(archivo)),
  subirMiFoto: (archivo) => api.subir('/auth/foto', formularioImagen(archivo)),
}
