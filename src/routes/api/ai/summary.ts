import { streamText } from 'ai'
import { createFileRoute } from '@tanstack/react-router'

import { prisma } from '@/db'
import { openrouter } from '@/lib/open-router'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const { itemId, prompt } = await request.json()
        if (!itemId || !prompt) {
          return new Response('Missing itemId or prompt', { status: 400 })
        }

        const item = await prisma.items.findUnique({
          where: { id: itemId, userId: context?.session.user.id },
        })

        if (!item) {
          return new Response('Item not found', { status: 404 })
        }

        const res = streamText({
          model: openrouter.chat('arcee-ai/trinity-mini:free'),
          system: `You are a helpful assistant that creates concise, informative summaries of web content.
                    Your summaries should:
                    - Be 2-3 paragraphs long
                    - Capture the main points and key takeaways
                    - Be written in a clear, professional tone`,
          prompt: `Please summarize the following content:\n\n${prompt}`,
        })

        return res.toTextStreamResponse()
      },
    },
  },
})
