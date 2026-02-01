import { toast } from 'sonner'
import { useState } from 'react'
import {
  AiContentGenerator01Icon,
  ArrowDown01Icon,
  Calendar02Icon,
  CircleArrowLeft01Icon,
  Clock03Icon,
  LinkSquare01Icon,
  UserAccountIcon,
} from '@hugeicons/core-free-icons'
import { useCompletion } from '@ai-sdk/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageResponse } from '@/components/ai-elements/message'
import { getItemByIdFn } from '@/modules/dashboard/functions/items/get-item-by-id'
import { generateSummaryAndTagsFn } from '@/modules/dashboard/functions/items/save-summary-and-generate-tags'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemByIdFn({ data: { id: params.itemId } }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title ?? 'Untitled' }],
  }),
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const [contentOpen, setContentOpen] = useState(false)
  const router = useRouter()

  const { completion, isLoading, complete } = useCompletion({
    api: '/api/ai/summary',
    streamProtocol: 'text',
    initialCompletion: data.summary ?? undefined,
    body: {
      itemId: data.id,
    },
    onError: () => toast.error('Failed to generate summary'),
    onFinish: async (_prompt, completionText) => {
      await generateSummaryAndTagsFn({
        data: {
          id: data.id,
          summary: completionText,
        },
      })
      toast.success('Summary generated successfully')
      router.invalidate()
    },
  })

  function handleGenerateSummary() {
    if (!data.content) {
      toast.error('No content found')
      return
    }

    complete(data.content)
  }

  return (
    <div className="mx-auto space-y-6 w-full">
      <div className="flex justify-start">
        <Button asChild variant="outline" className="">
          <Link to="/dashboard/items">
            <HugeiconsIcon icon={CircleArrowLeft01Icon} />
            Back to items
          </Link>
        </Button>
      </div>
      {data.ogImage && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-lg ">
          <img
            src={data.ogImage}
            alt={data.title ?? 'Thumbnail'}
            className="size-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {data.title ?? 'Untitled'}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {data.author && (
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon className="size-3.5" icon={UserAccountIcon} />
              {data.author}
            </span>
          )}

          {data.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon className="size-3.5" icon={Calendar02Icon} />
              {new Date(data.publishedAt).toLocaleDateString('en-US')}
            </span>
          )}

          <span className="inline-flex items-center gap-1">
            <HugeiconsIcon icon={Clock03Icon} className="size-3.5" />
            Saved at {new Date(data.createdAt).toLocaleDateString('en-US')}
          </span>
        </div>

        <a
          href={data.url}
          className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Orginal
          <HugeiconsIcon icon={LinkSquare01Icon} className="size-3.5" />
        </a>

        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <Badge key={index}>{tag}</Badge>
            ))}
          </div>
        )}

        <Card className="border-primary/20 border-dashed bg-primary/5">
          <CardContent>
            <div className="flex items-start  justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm uppercase tracking-wide text-primary font-semibold">
                  Summary
                </h2>

                {completion || data.summary ? (
                  <MessageResponse>{completion}</MessageResponse>
                ) : (
                  <p className="text-muted-foreground italic">
                    {data.content
                      ? 'No summary yet, generate on with ai'
                      : 'No content found'}
                  </p>
                )}
              </div>
              {data.content && !data.summary && (
                <Button
                  className={cn(isLoading && 'animate-pulse', 'mt-2')}
                  size="sm"
                  variant={isLoading ? 'secondary' : 'default'}
                  disabled={isLoading}
                  onClick={handleGenerateSummary}
                >
                  <HugeiconsIcon
                    className="size-4"
                    icon={AiContentGenerator01Icon}
                  />
                  Generate Summary
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {data.content && (
          <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="font-medium"> Full Content</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className={cn(
                    contentOpen && 'rotate-180',
                    'size-4 transition-transform ',
                  )}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent>
                  <MessageResponse>{data.content}</MessageResponse>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}
