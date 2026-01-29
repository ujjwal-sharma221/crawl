import { z } from 'zod/v4'
import { useForm } from '@tanstack/react-form'
import { useState, useTransition } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Loading02Icon } from '@hugeicons/core-free-icons'
import { type SearchResultWeb } from '@mendable/firecrawl-js'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { mapUrlFn } from '../../functions/items/map-url'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { bulkScrape } from '../../functions/items/bulk-scrape'

export function BulkTab() {
  const [isPending, startTransition] = useTransition()
  const [bulkIsPending, startBulkTransition] = useTransition()
  const [discoveredLinks, setDiscoveredLinks] = useState<
    Array<SearchResultWeb>
  >([])
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set())

  const form = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: BulkImportSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const data = await mapUrlFn({ data: value })
        setDiscoveredLinks(data.links)
      })
    },
  })

  function handleSelectAll() {
    if (selectedLinks.size === discoveredLinks.length) {
      setSelectedLinks(new Set())
    } else {
      setSelectedLinks(new Set(discoveredLinks.map((link) => link.url)))
    }
  }

  function handleSelectUrl(url: string) {
    const newSelected = new Set(selectedLinks)
    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }

    setSelectedLinks(newSelected)
  }

  function handleBulkImport() {
    if (selectedLinks.size === 0) {
      toast.error('Please select at least one URL to import')
      return
    }

    startBulkTransition(async () => {
      await bulkScrape({
        data: { urls: Array.from(selectedLinks) },
      })
      toast.success('Bulk import successful')
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import</CardTitle>
        <CardDescription>
          Discover and import multiple URLs from a web app at once
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <fieldset disabled={isPending}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="url"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="url"
                        aria-invalid={isInvalid}
                        placeholder="https://example.com"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="search"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Filter (optional)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        aria-invalid={isInvalid}
                        placeholder="blogs, docs, tutorials, etc."
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <Field>
                <Button type="submit">
                  Import
                  {isPending && (
                    <HugeiconsIcon
                      className="size-4 animate-spin"
                      icon={Loading02Icon}
                    />
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </fieldset>

        {discoveredLinks.length > 0 && (
          <div className="space-y-4 px-2">
            <div className="flex items-center justify-between px-4">
              <p className="text-sm font-medium">
                Discovered {discoveredLinks.length} links
              </p>

              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedLinks.size === discoveredLinks.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded-md border p-4">
              {discoveredLinks.map((link) => (
                <label
                  key={link.url}
                  className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-md p-2"
                >
                  <Checkbox
                    checked={selectedLinks.has(link.url)}
                    onCheckedChange={() => handleSelectUrl(link.url)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {link.title ?? 'No title found'}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {link.description ?? 'No description found'}
                    </p>

                    <p className="text-muted-foreground truncate text-xs">
                      {link.url}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={handleBulkImport}
              disabled={bulkIsPending}
              type="button"
            >
              {`Import ${selectedLinks.size} links`}
              {bulkIsPending && (
                <HugeiconsIcon
                  className="size-4 animate-spin"
                  icon={Loading02Icon}
                />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const BulkImportSchema = z.object({
  url: z.url(),
  search: z.string(),
})
