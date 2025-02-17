import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/modeling/')({
  component: () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Modeling Digitals</h1>
    </div>
  ),
}) 