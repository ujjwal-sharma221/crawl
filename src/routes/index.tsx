import { createFileRoute } from '@tanstack/react-router'

import { Navbar } from '@/components/navbar'
import { unAuthenticatedSession } from '@/modules/auth/functions/get-server-session'

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: () => unAuthenticatedSession(),
})

function App() {
  return (
    <div>
      <Navbar />
    </div>
  )
}
