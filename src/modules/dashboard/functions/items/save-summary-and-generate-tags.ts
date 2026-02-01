import z from 'zod/v4'
import { generateText } from 'ai'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { prisma } from '@/db'
import { authFnMiddleware } from '@/midlleware/auth-middleware'
import { openrouter } from '@/lib/open-router'

export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})

export const generateSummaryAndTagsFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string(), summary: z.string() }))
  .handler(async ({ data, context }) => {
    const existing = await prisma.items.findUnique({
      where: { id: data.id, userId: context.session.user.id },
    })

    if (!existing) {
      throw notFound()
    }

    const { text } = await generateText({
      model: openrouter.chat('arcee-ai/trinity-mini:free'),
      system: `You are a helpful assistant that extracts relevant tags from content summaries.
                Extract 3-5 short, relevant tags that categorize the content.
                Return ONLY a comma-separated list of tags, nothing else.
                Example: technology, programming, web development, javascript`,
      prompt: `Extract tags from this summary: \n\n${data.summary}`,
    })

    const tags = text
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
      .slice(0, 5)

    const updatedItem = await prisma.items.update({
      where: { id: data.id },
      data: {
        summary: data.summary,
        tags,
      },
    })

    return updatedItem
  })
