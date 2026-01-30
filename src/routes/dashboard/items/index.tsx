import z from 'zod/v4'
import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { zodValidator } from '@tanstack/zod-adapter'
import { Archive03Icon, SearchList02Icon } from '@hugeicons/core-free-icons'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

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

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ItemStatus } from '@/generated/prisma/enums'
import { Card, CardHeader } from '@/components/ui/card'
import { getItemsFn } from '@/modules/dashboard/functions/items/get-items'
import { ItemList } from '@/modules/dashboard/components/items/item-list'

const itemSearchSchema = z.object({
  search: z.string().default(''),
  status: z
    .union([z.enum(Object.values(ItemStatus)), z.literal('all')])
    .default('all'),
})

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => getItemsFn(),
  pendingComponent: () => <LoadingSkeleton />,
  validateSearch: zodValidator(itemSearchSchema),
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const { search, status } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    if (search === searchInput) return

    const timeoutId = setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, search: searchInput }) })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, navigate, search])

  if (data.length === 0) return <EmptyState />

  const filteredItems = data.filter((item) => {
    const matchQuery =
      search === '' ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = status === 'all' || item.status === status

    return matchQuery && matchStatus
  })

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">Manage your saved items here</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by title or tags"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Select
          value={status}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({ ...prev, status: value as typeof status }),
            })
          }
        >
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

      {filteredItems.length === 0 ? (
        <EmptyFilteredItems />
      ) : (
        <ItemList items={filteredItems} />
      )}
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
        <Button variant="outline" asChild>
          <Link to="/dashboard/import">Import urls</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

const EmptyFilteredItems = () => {
  return (
    <Empty className="border rounded-lg h-full">
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon icon={SearchList02Icon} className="size-12" />
        </EmptyMedia>

        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>
          No items found for the selected filter.
        </EmptyDescription>
      </EmptyHeader>
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
