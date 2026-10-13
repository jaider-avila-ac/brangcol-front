import { createBrowserRouter } from 'react-router'
import Layout from './components/layout/Layout'
import { itemsDelMenu } from './config/menu'
import Login from './modulos/auth/Login'
import MiCuenta from './modulos/auth/MiCuenta'
import RutaProtegida from './modulos/auth/RutaProtegida'
import EmpresaPagina from './modulos/empresa/EmpresaPagina'
import Inicio from './modulos/inicio/Inicio'
import EnConstruccion from './modulos/inicio/EnConstruccion'
import NoEncontrado from './modulos/inicio/NoEncontrado'
import AceptarInvitacion from './modulos/usuarios/AceptarInvitacion'
import UsuariosPagina from './modulos/usuarios/UsuariosPagina'
import FormularioTercero from './modulos/terceros/FormularioTercero'
import ImportarTerceros from './modulos/terceros/ImportarTerceros'
import TercerosPagina from './modulos/terceros/TercerosPagina'
import CategoriasMarcas from './modulos/productos/CategoriasMarcas'
import FormularioProducto from './modulos/productos/FormularioProducto'
import ProductosPagina from './modulos/productos/ProductosPagina'
import RecetasPagina from './modulos/productos/RecetasPagina'
import DetalleAjuste from './modulos/inventario/DetalleAjuste'
import DetalleTraslado from './modulos/inventario/DetalleTraslado'
import FormularioAjuste from './modulos/inventario/FormularioAjuste'
import FormularioTraslado from './modulos/inventario/FormularioTraslado'
import InventarioPagina from './modulos/inventario/InventarioPagina'
import Kardex from './modulos/inventario/Kardex'
import TomaFisica from './modulos/inventario/TomaFisica'
import DetalleProduccion from './modulos/inventario/DetalleProduccion'
import FormularioProduccion from './modulos/inventario/FormularioProduccion'

const construidas = [
  { path: 'mi-cuenta', element: <MiCuenta /> },
  { path: 'empresa', element: <EmpresaPagina /> },
  { path: 'usuarios', element: <UsuariosPagina /> },
  { path: 'terceros', element: <TercerosPagina /> },
  { path: 'terceros/nuevo', element: <FormularioTercero /> },
  { path: 'terceros/importar', element: <ImportarTerceros /> },
  { path: 'terceros/:codigo', element: <FormularioTercero /> },
  { path: 'productos', element: <ProductosPagina /> },
  { path: 'productos/nuevo', element: <FormularioProducto /> },
  { path: 'productos/categorias', element: <CategoriasMarcas /> },
  { path: 'productos/recetas', element: <RecetasPagina /> },
  { path: 'productos/:codigo', element: <FormularioProducto /> },
  { path: 'inventario', element: <InventarioPagina /> },
  { path: 'inventario/ajustes/nuevo', element: <FormularioAjuste /> },
  { path: 'inventario/ajustes/:codigo', element: <DetalleAjuste /> },
  { path: 'inventario/traslados/nuevo', element: <FormularioTraslado /> },
  { path: 'inventario/traslados/:codigo', element: <DetalleTraslado /> },
  { path: 'inventario/conteo', element: <TomaFisica /> },
  { path: 'inventario/produccion/nueva', element: <FormularioProduccion /> },
  { path: 'inventario/produccion/:codigo', element: <DetalleProduccion /> },
  { path: 'inventario/kardex/:item', element: <Kardex /> },
]

const rutasConstruidas = construidas.map((ruta) => '/' + ruta.path)

const pendientes = itemsDelMenu()
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
