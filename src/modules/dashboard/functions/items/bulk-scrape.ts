import { z } from 'zod/v4'
import { createServerFn } from '@tanstack/react-start'

import { prisma } from '@/db'
import { firecrawl } from '@/lib/firecrawl'
import { extractSchema } from './scrape-url'
import { authFnMiddleware } from '@/midlleware/auth-middleware'

export const bulkScrape = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(
    z.object({
      urls: z.array(z.url()),
    }),
  )
  .handler(async ({ data, context }) => {
    for (let i = 0; i < data.urls.length; i++) {
      const url = data.urls[i]

      const item = await prisma.items.create({
        data: {
          url: url,
          userId: context.session.user.id,
          status: 'PROCESSING',
        },
      })

      try {
        const res = await firecrawl.scrape(url, {
          formats: [
            'markdown',
            {
              type: 'json',
              // schema: extractSchema
              prompt: 'Please extract author and publishedAt timestamp',
            },
          ],
          onlyMainContent: true,
        })

        let publishedAt = null
        const jsonData = res.json as z.infer<typeof extractSchema>

        if (jsonData.publishedAt) {
          const parsed = new Date(jsonData.publishedAt)

          if (isNaN(parsed.getTime())) {
            publishedAt = parsed
          }
        }

        await prisma.items.update({
          where: {
            id: item.id,
          },
          data: {
            title: res.metadata?.title || null,
            content: res.markdown || null,
            ogImage: res.metadata?.ogImage || null,
            author: jsonData.author || null,
            publishedAt,
            status: 'COMPLETED',
          },
        })
      } catch (error) {
        console.log(error)
        await prisma.items.update({
          where: {
            id: item.id,
          },
          data: {
            status: 'FAILED',
          },
        })
      }
    }
  })
