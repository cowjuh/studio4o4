import { createRootRoute, Outlet } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export const Route = createRootRoute({
  component: () => (
    <div className="h-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center">
        <div className="max-w-7xl w-full mx-auto flex relative">
          <div className="w-[240px] fixed top-16 bottom-0">
            <Sidebar />
          </div>
          <main className="flex-1 ml-[240px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  ),
}) 