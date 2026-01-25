import { createFileRoute } from '@tanstack/react-router'

import { LoginScreen } from '@/modules/auth/screens/login-screen'

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginScreen />
}
