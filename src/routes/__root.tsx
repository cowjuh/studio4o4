import { createRootRoute, Outlet, useMatches } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const RootComponent = () => {
  const matches = useMatches()
  const isHomePage = matches.length === 1 || matches[matches.length - 1].pathname === '/'

  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex justify-center">
          <div className="max-w-7xl w-full mx-auto flex">
            {!isHomePage && (
              <div className="hidden md:block w-[240px] sticky top-16 h-[calc(100vh-4rem)]">
                <Sidebar orientation="vertical" />
              </div>
            )}
            <main className={`flex-1 lg:p-2 ${isHomePage ? 'w-full' : ''}`}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Footer />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools/>}
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
}) 