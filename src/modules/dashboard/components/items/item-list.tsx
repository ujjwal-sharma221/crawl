import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { CopyLinkIcon } from '@hugeicons/core-free-icons'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Items } from '@/generated/prisma/client'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export function ItemList({ items }: { items: Items[] }) {
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.message('Link copied to clipboard')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden transition-all hover:shadow-lg pt-0"
        >
          <Link
            to="/dashboard/items/$itemId"
            params={{ itemId: item.id }}
            className="block"
          >
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
                variant={item.status === 'COMPLETED' ? 'default' : 'secondary'}
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
  )
}
