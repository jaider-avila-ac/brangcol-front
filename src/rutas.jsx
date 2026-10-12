import { createBrowserRouter } from 'react-router'
import Layout from './components/layout/Layout'
import { menu } from './config/menu'
import Login from './modulos/auth/Login'
import MiCuenta from './modulos/auth/MiCuenta'
import RutaProtegida from './modulos/auth/RutaProtegida'
import Inicio from './modulos/inicio/Inicio'
import EnConstruccion from './modulos/inicio/EnConstruccion'
import NoEncontrado from './modulos/inicio/NoEncontrado'

const pendientes = menu
  .filter((item) => item.ruta !== '/')
  .map((item) => ({ path: item.ruta.substring(1), element: <EnConstruccion /> }))

export const rutas = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <RutaProtegida>
        <Layout />
      </RutaProtegida>
    ),
    children: [{ index: true, element: <Inicio /> }, { path: 'mi-cuenta', element: <MiCuenta /> }, ...pendientes],
  },
  { path: '*', element: <NoEncontrado /> },
])
