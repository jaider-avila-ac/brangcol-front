import { reportarError } from '../config/sentry'

const BASE = '/api/v1'

export class ErrorApi extends Error {
  constructor(estado, mensaje, traceId) {
    super(mensaje)
    this.estado = estado
    this.traceId = traceId
  }
}

async function leerMensaje(respuesta) {
  try {
    const cuerpo = await respuesta.json()
    if (cuerpo && cuerpo.message) {
      return cuerpo.message
    }
  } catch {
    return 'Ocurrió un error inesperado'
  }
  return 'Ocurrió un error inesperado'
}

async function pedir(metodo, ruta, cuerpo) {
  const opciones = {
    method: metodo,
    credentials: 'include',
    headers: { Accept: 'application/json' },
  }
  if (cuerpo instanceof FormData) {
    opciones.body = cuerpo
  } else if (cuerpo !== undefined) {
    opciones.headers['Content-Type'] = 'application/json'
    opciones.body = JSON.stringify(cuerpo)
  }

  let respuesta
  try {
    respuesta = await fetch(BASE + ruta, opciones)
  } catch {
    throw new ErrorApi(0, 'No hay conexión con el servidor', null)
  }

  if (!respuesta.ok) {
    const traceId = respuesta.headers.get('X-Trace-Id')
    const error = new ErrorApi(respuesta.status, await leerMensaje(respuesta), traceId)
    if (respuesta.status >= 500) {
      reportarError(error, traceId)
    }
    if (respuesta.status === 401) {
      window.dispatchEvent(new CustomEvent('sesion-vencida'))
    }
    throw error
  }

  if (respuesta.status === 204) {
    return null
  }
  return respuesta.json()
}

export const api = {
  get: (ruta) => pedir('GET', ruta),
  post: (ruta, cuerpo) => pedir('POST', ruta, cuerpo),
  put: (ruta, cuerpo) => pedir('PUT', ruta, cuerpo),
  patch: (ruta, cuerpo) => pedir('PATCH', ruta, cuerpo),
  delete: (ruta) => pedir('DELETE', ruta),
  subir: (ruta, formulario) => pedir('POST', ruta, formulario),
}

export const RUTA_API = BASE
