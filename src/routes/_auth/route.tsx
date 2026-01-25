import { ArrowLeftIcon } from 'lucide-react'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-8 left-8">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
