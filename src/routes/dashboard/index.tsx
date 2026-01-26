import { createFileRoute } from '@tanstack/react-router'

import { getServerSession } from '@/lib/auth'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  loader: () => getServerSession(),
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return <div>Hello {data.user.name}</div>
}
