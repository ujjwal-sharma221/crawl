import { z } from 'zod/v4'
import { useTransition } from 'react'
import { useForm } from '@tanstack/react-form'
import { HugeiconsIcon } from '@hugeicons/react'
import { Loading02Icon } from '@hugeicons/core-free-icons'

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
import { scrapeUrlFn } from '../../functions/items/scrape-url'

export function SingleTab() {
  const [isPending, startTransition] = useTransition()
  const form = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: SingleImportSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        await scrapeUrlFn({ data: value })
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import single URL</CardTitle>
        <CardDescription>
          Save and scrape content from any web app
        </CardDescription>
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  )
}

export const SingleImportSchema = z.object({
  url: z.url(),
})
