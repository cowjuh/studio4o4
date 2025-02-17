import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editorial/')({
  component: () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Editorial & Fine Art</h1>
    </div>
  ),
}) 