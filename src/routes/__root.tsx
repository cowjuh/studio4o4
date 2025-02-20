import { createRootRoute, Outlet, useMatches } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const RootComponent = () => {
  const matches = useMatches()
  const isHomePage = matches.length === 1 || matches[matches.length - 1].pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center">
        <div className="max-w-7xl w-full flex gap-6 px-2">
          <div className="hidden md:block w-[240px] flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
            <Sidebar orientation="vertical" />
          </div>
          <div className="min-w-0 flex-1 h-full">
            <main className={`py-2 h-full ${isHomePage ? 'w-full' : ''}`}>
              <Outlet />
            </main>
            {process.env.NODE_ENV === 'development' && (
              <div className="flex justify-end">
                <TanStackRouterDevtools />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
}) 