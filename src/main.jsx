import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import ProveedorTema from './components/tema/ProveedorTema'
import { iniciarSentry, LimiteErrores } from './config/sentry'
import { aplicarTema, temaGuardado } from './config/tema'
import ErrorPantalla from './modulos/inicio/ErrorPantalla'
import { rutas } from './rutas'
import './index.css'

aplicarTema(temaGuardado())
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
      <ProveedorTema>
        <QueryClientProvider client={consultas}>
          <RouterProvider router={rutas} />
        </QueryClientProvider>
      </ProveedorTema>
    </LimiteErrores>
  </StrictMode>,
)
