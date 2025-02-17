import { Outlet } from '@tanstack/react-router'
import Sidebar from './components/Sidebar'

export function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
