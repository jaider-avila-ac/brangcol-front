import { createBrowserRouter } from 'react-router'
import Layout from './components/layout/Layout'
import { menu } from './config/menu'
import Inicio from './modulos/inicio/Inicio'
import EnConstruccion from './modulos/inicio/EnConstruccion'
import NoEncontrado from './modulos/inicio/NoEncontrado'

const pendientes = menu
  .filter((item) => item.ruta !== '/')
  .map((item) => ({ path: item.ruta.substring(1), element: <EnConstruccion /> }))

export const rutas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <Inicio /> }, ...pendientes],
  },
  { path: '*', element: <NoEncontrado /> },
])
