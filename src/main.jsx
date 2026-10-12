import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { iniciarSentry, LimiteErrores } from './config/sentry'
import ErrorPantalla from './modulos/inicio/ErrorPantalla'
import { rutas } from './rutas'
import './index.css'

iniciarSentry()

const consultas = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LimiteErrores fallback={<ErrorPantalla />}>
      <QueryClientProvider client={consultas}>
        <RouterProvider router={rutas} />
      </QueryClientProvider>
    </LimiteErrores>
  </StrictMode>,
)
