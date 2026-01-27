import { createFileRoute } from '@tanstack/react-router'

import { ImportScreen } from '@/modules/dashboard/screens/import-screen'
import { getServerSession } from '@/modules/auth/functions/get-server-session'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
  beforeLoad: () => getServerSession(),
})

function RouteComponent() {
  return <ImportScreen />
}
