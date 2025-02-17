import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Studio 4O4</h1>
    </div>
  ),
}) 