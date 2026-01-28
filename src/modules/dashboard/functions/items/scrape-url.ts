import z from 'zod/v4'
import { createServerFn } from '@tanstack/react-start'

import { prisma } from '@/db'
import { firecrawl } from '@/lib/firecrawl'
import { SingleImportSchema } from '../../components/import/single-tab'
import { getServerSession } from '@/modules/auth/functions/get-server-session'

const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(SingleImportSchema)
  .handler(async ({ data }) => {
    const session = await getServerSession()

    const item = await prisma.items.create({
      data: {
        url: data.url,
        userId: session.user.id,
        status: 'PROCESSING',
      },
    })

    try {
      const res = await firecrawl.scrape(data.url, {
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

      const updatedItem = await prisma.items.update({
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

      return updatedItem
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
  })
