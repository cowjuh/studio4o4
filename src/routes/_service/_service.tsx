import { createFileRoute, Outlet } from '@tanstack/react-router'
import Sidebar from '@components/Sidebar'

export const Route = createFileRoute('/_service/_service')({
  component: () => (
    <div className="max-w-7xl w-full mx-auto flex">
      <div className="hidden md:block w-[240px] sticky top-16 h-[calc(100vh-4rem)]">
        <Sidebar orientation="vertical" />
      </div>
      <main className="flex-1 lg:p-2">
        <Outlet />
      </main>
    </div>
  ),
})
