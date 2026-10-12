import { useState } from 'react'
import { Outlet } from 'react-router'
import BarraSuperior from './BarraSuperior'
import MenuLateral from './MenuLateral'

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <BarraSuperior onMenu={() => setMenuAbierto(!menuAbierto)} />
      <div className="flex min-h-0 flex-1">
        <MenuLateral abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
