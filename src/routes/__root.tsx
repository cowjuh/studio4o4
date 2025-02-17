import { createRootRoute, Outlet } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const RootComponent = () => {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex justify-center">
          <div className="max-w-7xl w-full mx-auto flex">
            <div className="hidden md:block w-[240px] sticky top-16 h-[calc(100vh-4rem)]">
              <Sidebar orientation="vertical" />
            </div>

            <main className="flex-1 lg:p-2">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Footer />
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
}) 