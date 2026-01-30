import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { Archive03Icon, CopyLinkIcon } from '@hugeicons/core-free-icons'
import { createFileRoute, Link } from '@tanstack/react-router'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ItemStatus } from '@/generated/prisma/enums'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { getItemsFn } from '@/modules/dashboard/functions/items/get-items'

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => getItemsFn(),
  pendingComponent: () => <LoadingSkeleton />,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.message('Link copied to clipboard')
  }

  if (data.length === 0) return <EmptyState />

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">Manage your saved items here</p>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search by title or tags" />
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ItemStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden transition-all hover:shadow-lg pt-0"
            >
              <Link to="/dashboard" className="block">
                {item.ogImage && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={item.ogImage}
                      alt={item.title ?? 'Thumbnail'}
                      className="size-full object-cover transition-transform hover:scale-110"
                    />
                  </div>
                )}
              </Link>
              <CardHeader className="space-y-3 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={
                      item.status === 'COMPLETED' ? 'default' : 'secondary'
                    }
                  >
                    {item.status.toLowerCase()}
                  </Badge>
                  <Button
                    onClick={() => handleCopyLink(item.url)}
                    size="icon"
                    variant="outline"
                    className="size-8"
                  >
                    <HugeiconsIcon icon={CopyLinkIcon} className="size-4" />
                  </Button>
                </div>

                <CardTitle className="line-clamp-1 text-xl leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>

                {item.author && (
                  <p className="text-xs text-muted-foreground">{item.author}</p>
                )}
              </CardHeader>
            </Card>
          ))}
      </div>
    </div>
  )
}

const EmptyState = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={Archive03Icon} />
        </EmptyMedia>
        <EmptyTitle>No Items Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any items yet. Get started by creating your
          first item.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Create Item</Button>
        <Button variant="outline">Import Item</Button>
      </EmptyContent>
    </Empty>
  )
}

const LoadingSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full rounded-none" />
          <CardHeader className="space-y-3 pt-4">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="size-8" />
            </div>
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
