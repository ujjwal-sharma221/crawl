import { createFileRoute } from '@tanstack/react-router'

import { RegisterScreen } from '@/modules/auth/screens/register-screen'

export const Route = createFileRoute('/_auth/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterScreen />
}
