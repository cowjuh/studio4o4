import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">About</h1>
    </div>
  ),
}) 