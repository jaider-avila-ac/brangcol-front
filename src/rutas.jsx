import { createBrowserRouter } from 'react-router'
import Layout from './components/layout/Layout'
import { menu } from './config/menu'
import Login from './modulos/auth/Login'
import MiCuenta from './modulos/auth/MiCuenta'
import RutaProtegida from './modulos/auth/RutaProtegida'
import EmpresaPagina from './modulos/empresa/EmpresaPagina'
import Inicio from './modulos/inicio/Inicio'
import EnConstruccion from './modulos/inicio/EnConstruccion'
import NoEncontrado from './modulos/inicio/NoEncontrado'
import AceptarInvitacion from './modulos/usuarios/AceptarInvitacion'
import UsuariosPagina from './modulos/usuarios/UsuariosPagina'

const construidas = [
  { path: 'mi-cuenta', element: <MiCuenta /> },
  { path: 'empresa', element: <EmpresaPagina /> },
  { path: 'usuarios', element: <UsuariosPagina /> },
]

const rutasConstruidas = construidas.map((ruta) => '/' + ruta.path)

const pendientes = menu
  .filter((item) => item.ruta !== '/' && !rutasConstruidas.includes(item.ruta))
  .map((item) => ({ path: item.ruta.substring(1), element: <EnConstruccion /> }))

export const rutas = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/aceptar-invitacion', element: <AceptarInvitacion /> },
  {
    path: '/',
    element: (
      <RutaProtegida>
        <Layout />
      </RutaProtegida>
    ),
    children: [{ index: true, element: <Inicio /> }, ...construidas, ...pendientes],
  },
  { path: '*', element: <NoEncontrado /> },
])
