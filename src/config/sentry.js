import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

export function iniciarSentry() {
  if (!dsn) {
    return
  }
  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_ENTORNO || 'desarrollo',
    sendDefaultPii: false,
  })
}

export function reportarError(error, traceId) {
  if (!dsn) {
    return
  }
  Sentry.withScope((scope) => {
    if (traceId) {
      scope.setTag('traceId', traceId)
    }
    Sentry.captureException(error)
  })
}

export const LimiteErrores = Sentry.ErrorBoundary
