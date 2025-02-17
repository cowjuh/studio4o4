import { createRootRoute, Outlet } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  ),
}) 