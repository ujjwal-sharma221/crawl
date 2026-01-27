import { createFileRoute } from '@tanstack/react-router'

import { getServerSession } from '@/modules/auth/functions/get-server-session'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  loader: () => getServerSession(),
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  return <div>Hello {user.email}</div>
}
