import { createServerFn } from '@tanstack/react-start'

import { prisma } from '@/db'
import { authFnMiddleware } from '@/midlleware/auth-middleware'

export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const items = await prisma.items.findMany({
      where: {
        userId: context.session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return items
  })
