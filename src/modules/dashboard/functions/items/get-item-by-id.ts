import { z } from 'zod/v4'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { prisma } from '@/db'
import { authFnMiddleware } from '@/midlleware/auth-middleware'

export const getItemByIdFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const item = await prisma.items.findUnique({
      where: {
        userId: context.session.user.id,
        id: data.id,
      },
    })

    if (!item) {
      throw notFound()
    }

    return item
  })
