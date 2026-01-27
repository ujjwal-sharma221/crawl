import { createFileRoute, Outlet } from '@tanstack/react-router'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { getServerSession } from '@/modules/auth/functions/get-server-session'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,

  loader: async () => {
    const session = await getServerSession()
    return { user: session.user }
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return (
    <div>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
